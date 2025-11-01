import type { agendamentos, Prisma } from "@prisma/client";

interface IAppointmentRepository {
  create(data: Prisma.agendamentosUncheckedCreateInput): Promise<agendamentos>;
  listAll(): Promise<agendamentos[]>;
  findByClienteId(cliente_id: number): Promise<agendamentos[]>;
  findById(id: number): Promise<agendamentos | null>;
  verifyConflict(dateTime: Date, barbeiro_id: number, durationMinutes?: number): Promise<agendamentos | null>;
  updateStatus(id: number, status: string): Promise<agendamentos>;
  markPastAppointmentsAsCompleted(): Promise<number>;
  getOccupiedTimes(date: Date, barbeiro_id: number): Promise<Date[]>;
}

export type { IAppointmentRepository }