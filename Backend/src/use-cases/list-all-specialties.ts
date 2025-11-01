import type { especialidades } from "@prisma/client";
import type { ISpecialtiesRepository } from "../repositories/DTOspecialties";

interface ListAllSpecialtiesResponse {
  specialties: especialidades[];
}

export class ListAllSpecialtiesUseCase {
  constructor(private specialtiesRepository: ISpecialtiesRepository) {}

  async execute(): Promise<ListAllSpecialtiesResponse> {
    const specialties = await this.specialtiesRepository.findAll();
    return { specialties };
  }
}
