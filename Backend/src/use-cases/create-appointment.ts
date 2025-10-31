import type { agendamentos } from "@prisma/client";
import type { IAppointmentRepository } from "../repositories/DTOappointment";
import type { IBarberSpecialtiesRepository } from "../repositories/DTObarberSpecialties";
import type { ISpecialtiesRepository } from "../repositories/DTOspecialties";
import { DateValidations } from "../utils/date-validations";

interface CreateAppointmentRequest {
  cliente_id: number;
  barbeiro_especialidade_id: number;
  data: string;
  hora: string;
}

interface CreateAppointmentResponse {
  appointment: agendamentos;
}

export class CreateAppointmentUseCase {
  constructor(
    private appointmentsRepository: IAppointmentRepository,
    private barberSpecialtiesRepository: IBarberSpecialtiesRepository,
    private specialtiesRepository: ISpecialtiesRepository
  ) {}

  async execute({
    cliente_id,
    barbeiro_especialidade_id,
    data,
    hora,
  }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    // Parsear data e hora manualmente para evitar problemas de fuso horário
    // Formato esperado: data = "YYYY-MM-DD", hora = "HH:MM"
    const [ano, mes, dia] = data.split('-').map(Number);
    const [horas, minutos] = hora.split(':').map(Number);
    
    // Criar data no horário local (não UTC) para evitar problemas de conversão
    const dateTime = new Date(ano, mes - 1, dia, horas, minutos, 0, 0);
    
    // Validar se a data foi criada corretamente
    if (isNaN(dateTime.getTime())) {
      throw new Error('Data ou hora inválida. Use o formato: data "YYYY-MM-DD" e hora "HH:MM"');
    }
    
    // Validar se a data criada corresponde à data fornecida (para evitar problemas de parse)
    if (dateTime.getFullYear() !== ano || 
        dateTime.getMonth() !== (mes - 1) || 
        dateTime.getDate() !== dia ||
        dateTime.getHours() !== horas ||
        dateTime.getMinutes() !== minutos) {
      throw new Error('Data ou hora inválida. Verifique os valores fornecidos.');
    }

    DateValidations.validateBusinessHours(dateTime);
    DateValidations.validateFutureDate(dateTime);

    const barberSpecialty = await this.barberSpecialtiesRepository.findById(barbeiro_especialidade_id);
    if (!barberSpecialty) {
      throw new Error('Combinação barbeiro-especialidade não encontrada');
    }

    const conflito = await this.appointmentsRepository.verifyConflict(
      dateTime,
      barbeiro_especialidade_id
    );

    if (conflito) {
      throw new Error('Já existe um agendamento neste horário para este barbeiro');
    }

    const especialidade = await this.specialtiesRepository.findById(barberSpecialty.especialidade_id);
    
    const horaFim = new Date(dateTime);
    horaFim.setMinutes(horaFim.getMinutes() + especialidade.duracao_minutos);

    const appointment = await this.appointmentsRepository.create({
      cliente_id,
      barbeiro_especialidade_id,
      data_horario: dateTime,
      status: 'ativo'
    });

    return { appointment };
  }
}