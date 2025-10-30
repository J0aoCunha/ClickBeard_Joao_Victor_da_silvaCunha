import type { agendamentos } from "@prisma/client";
import type { IAppointmentRepository } from "../repositories/DTOappointment";

interface ListAppointmentsResponse {
  appointments: agendamentos[];
}

export class ListAppointmentsUseCase {
  constructor(private appointmentsRepository: IAppointmentRepository) {}

  async execute(): Promise<ListAppointmentsResponse> {
    const appointments = await this.appointmentsRepository.listAll();
    return { appointments };
  }
}