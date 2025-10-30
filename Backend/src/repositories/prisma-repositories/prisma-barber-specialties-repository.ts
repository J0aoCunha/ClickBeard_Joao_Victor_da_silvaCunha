import type { Prisma } from "@prisma/client";
import type { IBarberSpecialtiesRepository } from "../DTObarberSpecialties";
import { prisma } from "../../lib/prisma";

class PrismaBarberSpecialtiesRepository implements IBarberSpecialtiesRepository {

  async listBarberBySpecialty(barberId: number){
    const specialties = await prisma.barbeiro_especialidade.findMany({
      where: {
        barbeiro_id: barberId
      }
    })
    
    return specialties;
  }

  async listSpecialtyByBarber(specialtyId: number){
    const barbers = await prisma.barbeiro_especialidade.findMany({
      where: {
        especialidade_id: specialtyId
      }
    })

    return barbers;
  }


  async delete(barbeiro_id: number, especialidade_id: number){
    await prisma.barbeiro_especialidade.deleteMany({
      where: {
        barbeiro_id,
        especialidade_id
      }
    })
  }

  async connectBarberSpecialty(data: Prisma.barbeiro_especialidadeUncheckedCreateInput){
    await prisma.barbeiro_especialidade.create({
      data: {
        barbeiro_id: data.barbeiro_id,
        especialidade_id: data.especialidade_id
      }
    })
  }

  async disconnectBarberSpecialty(data: Prisma.barbeiro_especialidadeUncheckedCreateInput){
    await prisma.barbeiro_especialidade.deleteMany({
      where: {
        barbeiro_id: data.barbeiro_id,
        especialidade_id: data.especialidade_id
      }
    })
  }
}