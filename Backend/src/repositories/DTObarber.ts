import type { barbeiros, Prisma } from "@prisma/client";
import type { Numeric } from "zod/v4/core/util.cjs";

interface IBarberRepository {
  create(data: Prisma.barbeirosUncheckedCreateInput, adminId: number): Promise<barbeiros>
  findById(id: number): Promise<barbeiros>
  list(): Promise<barbeiros[]>
  searchByName(query: string): Promise<barbeiros[]>
}

export type { IBarberRepository }