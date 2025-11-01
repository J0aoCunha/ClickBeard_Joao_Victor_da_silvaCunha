import type { agendamentos } from "@prisma/client";
import type { IAppointmentRepository } from "../repositories/DTOappointment";

interface ListAllAppointmentsResponse {
  appointments: agendamentos[];
}

export class ListAllAppointmentsUseCase {
  constructor(private appointmentsRepository: IAppointmentRepository) {}

  async execute(): Promise<ListAllAppointmentsResponse> {
    // O repository.listAll() já marca os passados como concluídos
    const appointments = await this.appointmentsRepository.listAll();
    return { appointments };
  }
}

