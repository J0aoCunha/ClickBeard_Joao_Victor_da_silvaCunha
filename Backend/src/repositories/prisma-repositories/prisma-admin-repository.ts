import type { Prisma} from "@prisma/client";
import type { IAdminRepository } from "../DTOadmin";
import { prisma } from "../../lib/prisma";

class PrismaAdminRepository implements IAdminRepository {

  async findByEmail(email: string){
   
    const admin = await prisma.administradores.findUnique({
      where: { 
        email 
      }
    });

    return admin;
  }

  async findById(id: number){
    
    const admin = await prisma.administradores.findUnique({
      where: { 
        id 
      }
    });

    return admin;
  }

  async create(data: Prisma.administradoresUncheckedCreateInput){
    const admin = await prisma.administradores.create({
      data
    })

    return admin
  }

}


export { PrismaAdminRepository }