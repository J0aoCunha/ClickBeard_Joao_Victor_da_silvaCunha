import type { agendamentos } from "@prisma/client";
import type { IAppointmentRepository } from "../repositories/DTOappointment";

interface ListAppointmentsRequest {
  cliente_id: number;
}

interface ListAppointmentsResponse {
  appointments: agendamentos[];
}

export class ListAppointmentsUseCase {
  constructor(private appointmentsRepository: IAppointmentRepository) {}

  async execute({ cliente_id }: ListAppointmentsRequest): Promise<ListAppointmentsResponse> {
    const appointments = await this.appointmentsRepository.findByClienteId(cliente_id);
    return { appointments };
  }
}