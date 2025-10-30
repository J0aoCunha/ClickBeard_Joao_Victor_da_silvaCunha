import type { especialidades, Prisma } from "@prisma/client";

interface ISpecialtiesRepository {
  create(data: Prisma.especialidadesUncheckedCreateInput): Promise<especialidades>
  findAll(): Promise<especialidades[]>
  findByName(name: string): Promise<especialidades | null>
  update(id: number, value: number): Promise<especialidades>
  findById(id: number): Promise<especialidades>
}

export type {ISpecialtiesRepository}