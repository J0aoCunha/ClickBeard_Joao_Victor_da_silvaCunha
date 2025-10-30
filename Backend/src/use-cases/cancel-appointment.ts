import type { agendamentos } from "@prisma/client";
import type { IAppointmentRepository } from "../repositories/DTOappointment";

interface CancelAppointmentRequest {
  appointment_id: number;
}

interface CancelAppointmentResponse {
  appointment: agendamentos;
}

export class CancelAppointmentUseCase {
  constructor(private appointmentsRepository: IAppointmentRepository) {}

  async execute({
    appointment_id,
  }: CancelAppointmentRequest): Promise<CancelAppointmentResponse> {
    // Verificar se o agendamento existe
    const appointment = await this.appointmentsRepository.findById(appointment_id);
    if (!appointment) {
      throw new Error('Agendamento não encontrado');
    }

    // Verificar se já não está cancelado
    if (appointment.status === 'cancelado') {
      throw new Error('Agendamento já está cancelado');
    }

    // Verificar se o agendamento é futuro
    const appointmentDate = new Date(appointment.data_horario);
    if (appointmentDate < new Date()) {
      throw new Error('Não é possível cancelar agendamentos passados');
    }

    const updatedAppointment = await this.appointmentsRepository.updateStatus(
      appointment_id,
      'cancelado'
    );

    return { appointment: updatedAppointment };
  }
}