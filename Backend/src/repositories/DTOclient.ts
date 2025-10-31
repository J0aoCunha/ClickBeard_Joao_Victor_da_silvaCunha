import type { clientes, Prisma, agendamentos } from "@prisma/client";

interface IClientRepository {
  create(data: Prisma.clientesUncheckedCreateInput): Promise<clientes>
  findById(id: number): Promise<clientes>
  findByIdWithAppointments(id: number): Promise<clientes & { agendamentos: agendamentos[] } | null>
  findByEmail(email: string): Promise<clientes | null>
}

export type {IClientRepository}