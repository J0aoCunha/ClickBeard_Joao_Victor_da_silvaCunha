import type { agendamentos } from "@prisma/client";
import type { IAppointmentRepository } from "../repositories/DTOappointment";

interface CancelAppointmentRequest {
  appointment_id: number;
  cliente_id: number;
  isAdmin: boolean;
}

interface CancelAppointmentResponse {
  appointment: agendamentos;
}

export class CancelAppointmentUseCase {
  constructor(private appointmentsRepository: IAppointmentRepository) {}

  async execute({
    appointment_id,
    cliente_id,
    isAdmin,
  }: CancelAppointmentRequest): Promise<CancelAppointmentResponse> {
    // Verificar se o agendamento existe
    const appointment = await this.appointmentsRepository.findById(appointment_id);
    
    if (!appointment) {
      throw new Error('Agendamento não encontrado');
    }

    // Garantir que os IDs sejam números para comparação correta
    const appointmentClienteId = Number(appointment.cliente_id);
    const requestClienteId = Number(cliente_id);

    // Verificar se é o dono do agendamento OU se é admin
    if (!isAdmin && appointmentClienteId !== requestClienteId) {
      throw new Error('Você não tem permissão para cancelar este agendamento');
    }

    // Verificar se já não está cancelado
    if (appointment.status === 'cancelado') {
      throw new Error('Agendamento já está cancelado');
    }

    // Verificar se o agendamento é futuro (admins podem cancelar passados)
    if (!isAdmin) {
      const appointmentDate = new Date(appointment.data_horario);
      const now = new Date();
      if (appointmentDate < now) {
        throw new Error('Não é possível cancelar agendamentos passados');
      }
    }

    const updatedAppointment = await this.appointmentsRepository.updateStatus(
      appointment_id,
      'cancelado'
    );

    return { appointment: updatedAppointment };
  }
}