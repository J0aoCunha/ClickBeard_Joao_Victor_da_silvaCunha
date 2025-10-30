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
    const dateTime = new Date(`${data}T${hora}`);

    DateValidations.validateBusinessHours(dateTime);
    DateValidations.validateFutureDate(dateTime);

    const barberSpecialty = await this.barberSpecialtiesRepository.findById(barbeiro_especialidade_id);
    if (!barberSpecialty) {
      throw new Error('Combinação barbeiro-especialidade não encontrada');
    }

    const conflito = await this.appointmentsRepository.verifyConflict(
      data,
      hora,
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