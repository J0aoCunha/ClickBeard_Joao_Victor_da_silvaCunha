import type { Prisma } from "@prisma/client";
import type { IBarberRepository } from "../DTObarber";
import { prisma } from "../../lib/prisma";

class PrismaBarberRespository implements IBarberRepository {

 async create(data: Prisma.barbeirosCreateInput, adminId: number) {
    const barber = await prisma.barbeiros.create({
      data: {
        ...data,
        administradores:{
          connect: { id: adminId }
        }
      }
    })

    return barber
  }

 async findById(id: number) {
    const barber = await prisma.barbeiros.findUniqueOrThrow({
      where: {
        id
      }
    })

    return barber
  }

 async list() {
   const barbers = await prisma.barbeiros.findMany()
  
   return barbers
  }

}

export { PrismaBarberRespository }