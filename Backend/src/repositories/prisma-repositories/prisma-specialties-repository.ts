import type { Prisma} from "@prisma/client";
import type { ISpecialtiesRepository } from "../DTOspecialties";
import { prisma } from "../../lib/prisma";

class PrismaSpecialtiesRepository implements ISpecialtiesRepository {

  async create(data: Prisma.especialidadesUncheckedCreateInput){
    const specialty = await prisma.especialidades.create({
      data
    })

    return specialty
  }

  async findAll(){ 
    const specialties = await prisma.especialidades.findMany();
    
    return specialties;
  }

  async findByName(name: string){
    const specialty = await prisma.especialidades.findUniqueOrThrow({
      where: {
        nome: name
      }
    });

    return specialty;
  }
  

  async update(id: number, value: number){
    const specialty = await prisma.especialidades.update({
      where: {
        id
      },
      data: {
        valor: value
      }
    });

    return specialty;
  }

  async findById(id: number){
    const specialty = await prisma.especialidades.findUniqueOrThrow({
      where: {
        id
      }
    });

    return specialty;
  }
}


export { PrismaSpecialtiesRepository }