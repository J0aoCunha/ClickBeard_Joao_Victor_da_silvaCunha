
import type { IClientRepository } from "../repositories/DTOclient";

interface GetClientProfileRequest {
  clientId: number;
}

interface GetClientProfileResponse {
  nome: string;
  email: string;
  agendamentos: Array<{
    id: number;
    data_horario_formatada: string;
    status: string | null;
    especialidade: string;
    barbeiro: string;
  }>;
}

export class GetClientProfileUseCase {
  constructor(private clientsRepository: IClientRepository) {}

  private formatDate(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
  }

  async execute({ clientId }: GetClientProfileRequest): Promise<GetClientProfileResponse> {
    const client = await this.clientsRepository.findByIdWithAppointments(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    return {
      nome: client.nome,
      email: client.email,
      agendamentos: client.agendamentos.map(appointment => ({
        id: appointment.id,
        data_horario_formatada: this.formatDate(appointment.data_horario),
        status: appointment.status || 'ativo',
        especialidade: appointment.barbeiro_especialidade?.especialidades?.nome || 'Não informado',
        barbeiro: appointment.barbeiro_especialidade?.barbeiros?.nome || 'Não informado',
      }))
    };
  }
}
