
import type { especialidades } from "@prisma/client";
import type { ISpecialtiesRepository } from "../repositories/DTOspecialties";

interface CreateSpecialtyRequest {
  name: string;
  value: number;
  duration_minutes: number;
}

interface CreateSpecialtyResponse {
  specialty: especialidades;
}

export class CreateSpecialtyUseCase {
  constructor(private specialtiesRepository: ISpecialtiesRepository) {}

  async execute({
    name,
    value,
    duration_minutes,
  }: CreateSpecialtyRequest): Promise<CreateSpecialtyResponse> {
    const specialtyAlreadyExists = await this.specialtiesRepository.findByName(name);

    if (specialtyAlreadyExists) {
      throw new Error("Specialty already exists");
    }

    const specialty = await this.specialtiesRepository.create({
      nome: name,
      valor: value,
      duracao_minutos: duration_minutes,
    });

    return { specialty };
  }
}
