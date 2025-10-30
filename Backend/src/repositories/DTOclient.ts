import type { clientes, Prisma } from "@prisma/client";

interface IClientRepository {
  create(data: Prisma.clientesUncheckedCreateInput): Promise<clientes>
  findById(id: number): Promise<clientes>
  findByEmail(email: string): Promise<clientes>
}

export type {IClientRepository}