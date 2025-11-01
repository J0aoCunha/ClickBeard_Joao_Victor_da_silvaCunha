import type { IBarberSpecialtiesRepository } from "../repositories/DTObarberSpecialties";

interface ListBarberSpecialtiesRequest {
  barbeiro_id: number;
}

interface ListBarberSpecialtiesResponse {
  specialties: Awaited<ReturnType<IBarberSpecialtiesRepository['listBarberBySpecialty']>>;
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