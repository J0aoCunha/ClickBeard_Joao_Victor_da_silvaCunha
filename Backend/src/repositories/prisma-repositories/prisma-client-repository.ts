import type { Prisma } from "@prisma/client";
import type { IClientRepository } from "../DTOclient";
import { prisma } from "../../lib/prisma";

class PrismaClientRepository implements IClientRepository {

  async create(data: Prisma.clientesUncheckedCreateInput) {

    const client = await prisma.clientes.create({
      data
    })

    return client
  }

  async findById(id: number) {
    const client = await prisma.clientes.findUniqueOrThrow({
      where: {
        id
      }
    })

    return client
  }

  async findByIdWithAppointments(id: number) {
    const client = await prisma.clientes.findUnique({
      where: {
        id
      },
      include: {
        agendamentos: {
          orderBy: {
            data_horario: 'desc'
          },
          include: {
            barbeiro_especialidade: {
              include: {
                barbeiros: true,
                especialidades: true
              }
            }
          }
        }
      }
    })

    return client
  }

  async findByEmail(email: string) {
  const client = await prisma.clientes.findUnique({
        where: {
          email
        }
  })

    return client
  }

}

export { PrismaClientRepository }