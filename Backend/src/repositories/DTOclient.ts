import type { clientes, Prisma, agendamentos, barbeiro_especialidade, barbeiros, especialidades } from "@prisma/client";

type AppointmentWithRelations = agendamentos & {
  barbeiro_especialidade: (barbeiro_especialidade & {
    barbeiros: barbeiros;
    especialidades: especialidades;
  }) | null;
};

interface IClientRepository {
  create(data: Prisma.clientesUncheckedCreateInput): Promise<clientes>
  findById(id: number): Promise<clientes>
  findByIdWithAppointments(id: number): Promise<(clientes & { agendamentos: AppointmentWithRelations[] }) | null>
  findByEmail(email: string): Promise<clientes | null>
}

export type {IClientRepository}