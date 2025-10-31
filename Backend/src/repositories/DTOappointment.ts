import type { agendamentos, Prisma } from "@prisma/client";

interface IAppointmentRepository {
  create(data: Prisma.agendamentosUncheckedCreateInput): Promise<agendamentos>;
  listAll(): Promise<agendamentos[]>;
  findById(id: number): Promise<agendamentos | null>;
  verifyConflict(dateTime: Date, barbeiro_especialidade_id: number): Promise<agendamentos | null>;
  updateStatus(id: number, status: string): Promise<agendamentos>;
}

export type { IAppointmentRepository }