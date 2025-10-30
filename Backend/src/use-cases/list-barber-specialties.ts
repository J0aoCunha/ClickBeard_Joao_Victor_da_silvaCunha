import type { barbeiro_especialidade } from "@prisma/client";
import type { IBarberSpecialtiesRepository } from "../repositories/DTObarberSpecialties";

interface ListBarberSpecialtiesRequest {
  barbeiro_id: number;
}

interface ListBarberSpecialtiesResponse {
  specialties: barbeiro_especialidade[];
}

export class ListBarberSpecialtiesUseCase {
  constructor(private barberSpecialtiesRepository: IBarberSpecialtiesRepository) {}

  async execute({
    barbeiro_id,
  }: ListBarberSpecialtiesRequest): Promise<ListBarberSpecialtiesResponse> {
    const specialties = await this.barberSpecialtiesRepository.listBarberBySpecialty(barbeiro_id);

    return { specialties };
  }
}