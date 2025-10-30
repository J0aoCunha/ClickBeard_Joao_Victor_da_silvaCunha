import type { barbeiros, Prisma } from "@prisma/client";

interface IBarberRepository {
  create(data: Prisma.barbeirosUncheckedCreateInput): Promise<barbeiros>
  findById(id: number): Promise<barbeiros>
  list(): Promise<barbeiros[]>
}

export type { IBarberRepository }