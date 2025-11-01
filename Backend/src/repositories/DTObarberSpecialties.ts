import type { barbeiro_especialidade, Prisma, especialidades } from "@prisma/client";

type BarberSpecialtyWithRelation = barbeiro_especialidade & {
  especialidades?: especialidades;
};

interface IBarberSpecialtiesRepository {
  listBarberBySpecialty(barberId: number): Promise<BarberSpecialtyWithRelation[]>;
  listSpecialtyByBarber(specialtyId: number): Promise<barbeiro_especialidade[]>;
  findById(id: number): Promise<barbeiro_especialidade | null>;
  delete(barbeiro_id: number, especialidade_id: number): Promise<void>;
  connectBarberSpecialty(data: Prisma.barbeiro_especialidadeUncheckedCreateInput): Promise<void>;
  disconnectBarberSpecialty(data: Prisma.barbeiro_especialidadeUncheckedCreateInput): Promise<void>;
}

export type { IBarberSpecialtiesRepository }