import type { barbeiro_especialidade, Prisma } from "@prisma/client";

interface IBarberSpecialtiesRepository {
  listBarberBySpecialty(barberId: number): Promise<barbeiro_especialidade[]>;
  listSpecialtyByBarber(specialtyId: number): Promise<barbeiro_especialidade[]>;
  findById(id: number): Promise<barbeiro_especialidade | null>;
  delete(barbeiro_id: number, especialidade_id: number): Promise<void>;
  connectBarberSpecialty(data: Prisma.barbeiro_especialidadeUncheckedCreateInput): Promise<void>;
  disconnectBarberSpecialty(data: Prisma.barbeiro_especialidadeUncheckedCreateInput): Promise<void>;
}

export type { IBarberSpecialtiesRepository }