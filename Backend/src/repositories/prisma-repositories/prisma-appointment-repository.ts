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
    // Marcar agendamentos passados como concluídos antes de listar
    await this.markPastAppointmentsAsCompleted();
    
    const appointments =  await prisma.agendamentos.findMany({
      orderBy: {
        data_horario: 'asc'
      }
    });
    return appointments;
  }

  async findByClienteId(cliente_id: number){
    // Marcar agendamentos passados como concluídos antes de listar
    await this.markPastAppointmentsAsCompleted();
    
    const appointments = await prisma.agendamentos.findMany({
      where: {
        cliente_id
      },
      orderBy: {
        data_horario: 'desc'
      }
    });
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

  async verifyConflict(dateTime: Date, barbeiro_id: number, durationMinutes?: number){
    // Verificar se há agendamento no mesmo horário exato para este barbeiro (independente da especialidade)
    const appointmentSameTime = await prisma.agendamentos.findFirst({
      where: {
        barbeiro_especialidade: {
          barbeiro_id: barbeiro_id
        },
        status: {
          not: 'cancelado'
        },
        data_horario: dateTime
      }
    });

    if (appointmentSameTime) {
      return appointmentSameTime;
    }

    // Se temos duração, verificar sobreposição considerando a duração dos serviços
    if (durationMinutes && durationMinutes > 0) {
      const newStartTime = dateTime;
      const newEndTime = new Date(newStartTime);
      newEndTime.setMinutes(newEndTime.getMinutes() + durationMinutes);

      // Buscar todos os agendamentos ativos no mesmo dia para este barbeiro (independente da especialidade)
      const startOfDay = new Date(dateTime);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateTime);
      endOfDay.setHours(23, 59, 59, 999);

      const appointmentsSameDay = await prisma.agendamentos.findMany({
        where: {
          barbeiro_especialidade: {
            barbeiro_id: barbeiro_id
          },
          status: {
            not: 'cancelado'
          },
          data_horario: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        include: {
          barbeiro_especialidade: {
            include: {
              especialidades: true
            }
          }
        }
      });

      // Verificar sobreposição com cada agendamento
      for (const existingAppointment of appointmentsSameDay) {
        const existingStartTime = existingAppointment.data_horario;
        const existingDuration = existingAppointment.barbeiro_especialidade?.especialidades?.duracao_minutos || 30; // Default 30min se não encontrar
        const existingEndTime = new Date(existingStartTime);
        existingEndTime.setMinutes(existingEndTime.getMinutes() + existingDuration);

        // Verifica se há sobreposição: o novo agendamento não pode começar antes do existente terminar
        // e não pode terminar depois do existente começar
        if ((newStartTime < existingEndTime) && (newEndTime > existingStartTime)) {
          return existingAppointment;
        }
      }
    }

    return null;
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

  async markPastAppointmentsAsCompleted(): Promise<number> {
    const now = new Date();
    
    const result = await prisma.agendamentos.updateMany({
      where: {
        data_horario: {
          lt: now
        },
        status: 'ativo'
      },
      data: {
        status: 'concluído'
      }
    });

    return result.count;
  }

  async getOccupiedTimes(date: Date, barbeiro_id: number): Promise<Date[]> {
    // Início e fim do dia
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Buscar agendamentos do barbeiro na data, independente da especialidade
    const appointments = await prisma.agendamentos.findMany({
      where: {
        barbeiro_especialidade: {
          barbeiro_id: barbeiro_id
        },
        data_horario: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: 'cancelado'
        }
      },
      select: {
        data_horario: true
      }
    });

    return appointments.map(apt => apt.data_horario);
  }

}


export { PrismaAppointmentRepository }