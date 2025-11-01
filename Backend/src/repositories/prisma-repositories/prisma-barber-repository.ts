import type { Prisma } from "@prisma/client";
import type { IBarberRepository } from "../DTObarber";
import { prisma } from "../../lib/prisma";

class PrismaBarberRespository implements IBarberRepository {

 async create(data: Prisma.barbeirosUncheckedCreateInput, adminId: number) {
    const barber = await prisma.barbeiros.create({
      data: {
        ...data,
        criado_por: adminId
      }
    })

    return barber
  }

 async findById(id: number) {
    // Validar se o ID é válido
    if (id === undefined || id === null || isNaN(Number(id)) || Number(id) <= 0) {
      throw new Error('ID do barbeiro é inválido');
    }
    
    const numericId = Number(id);

    const barber = await prisma.barbeiros.findUnique({
      where: {
        id: numericId
      }
    })

    if (!barber) {
      throw new Error('Barbeiro não encontrado');
    }

    return barber
  }

 async list() {
   const barbers = await prisma.barbeiros.findMany()
  
   return barbers
  }

  async searchByName(query: string) {
    if (!query || query.trim() === "") {
      return this.list()
    }
    
    const barbers = await prisma.barbeiros.findMany({
      where: {
        nome: {
          contains: query,
          mode: 'insensitive'
        }
      }
    })
    
    return barbers
  }

}

export { PrismaBarberRespository }