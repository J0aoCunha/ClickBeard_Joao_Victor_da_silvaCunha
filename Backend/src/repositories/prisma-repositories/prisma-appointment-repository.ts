import type { Prisma} from "@prisma/client";
import type { IAppointmentRepository } from "../DTOappointment";
import { prisma } from "../../lib/prisma";

class PrismaAppointmentRepository implements IAppointmentRepository {
  async create(data: Prisma.agendamentosUncheckedCreateInput){

    const appointment = await prisma.agendamentos.create({
      data
    });

    return appointment;
  }

  async listAll(){
    const appointments =  await prisma.agendamentos.findMany();
    return appointments;
  }

  async findById(id: number){

    const appointment = await prisma.agendamentos.findUnique({
      where: { 
        id 
      }
    });

    return appointment;
  }

  async verifyConflict(date: string, time: string, barbeiro_especialidade_id: number){
    const appointment = await prisma.agendamentos.findFirst({
      where: {
        data_horario: `${date}T${time}`,
        barbeiro_especialidade_id: barbeiro_especialidade_id
      }
    });

    return appointment;
  }

  async updateStatus(id: number, status: string) {
    const appointment = await prisma.agendamentos.update({
      where: {
        id
      },
      data: {
        status
      }
    });

    return appointment;
  }

}


export { PrismaAppointmentRepository }