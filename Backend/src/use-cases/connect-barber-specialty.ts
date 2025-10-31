import type { barbeiro_especialidade } from "@prisma/client";
import type { IBarberSpecialtiesRepository } from "../repositories/DTObarberSpecialties";
import type { IBarberRepository } from "../repositories/DTObarber";
import type { ISpecialtiesRepository } from "../repositories/DTOspecialties";

interface ConnectBarberSpecialtyRequest {
  barbeiro_id: number;
  especialidade_id: number;
}

interface ConnectBarberSpecialtyResponse {
  message: string;
}

export class ConnectBarberSpecialtyUseCase {
  constructor(
    private barberSpecialtiesRepository: IBarberSpecialtiesRepository,
    private barberRepository: IBarberRepository,
    private specialtiesRepository: ISpecialtiesRepository
  ) {}

  async execute({
    barbeiro_id,
    especialidade_id,
  }: ConnectBarberSpecialtyRequest): Promise<ConnectBarberSpecialtyResponse> {
    // Verificar se o barbeiro existe (o repository lança erro se não encontrar)
    await this.barberRepository.findById(barbeiro_id);

    // Verificar se a especialidade existe (o repository lança erro se não encontrar)
    await this.specialtiesRepository.findById(especialidade_id);

    // Conectar barbeiro com especialidade
    await this.barberSpecialtiesRepository.connectBarberSpecialty({
      barbeiro_id,
      especialidade_id,
    });

    return { message: 'Especialidade vinculada com sucesso' };
  }
}