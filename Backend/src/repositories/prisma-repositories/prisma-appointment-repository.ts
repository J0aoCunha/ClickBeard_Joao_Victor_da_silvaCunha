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

  async verifyConflict(dateTime: Date, barbeiro_especialidade_id: number){
    // Buscar agendamentos que possam ter conflito de horário
    // Considera que pode haver overlap de horários baseado na duração do serviço
    // Por enquanto, verifica se há agendamento no mesmo horário exato
    const appointment = await prisma.agendamentos.findFirst({
      where: {
        barbeiro_especialidade_id: barbeiro_especialidade_id,
        status: {
          not: 'cancelado' // Ignora agendamentos cancelados
        },
        data_horario: dateTime
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