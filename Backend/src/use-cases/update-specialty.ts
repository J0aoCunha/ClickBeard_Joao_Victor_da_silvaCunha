import type { especialidades } from "@prisma/client";
import type { ISpecialtiesRepository } from "../repositories/DTOspecialties";

interface UpdateSpecialtyRequest {
  id: number;
  valor: number;
}

interface UpdateSpecialtyResponse {
  specialty: especialidades;
}

export class UpdateSpecialtyUseCase {
  constructor(private specialtiesRepository: ISpecialtiesRepository) {}

  async execute({ id, valor }: UpdateSpecialtyRequest): Promise<UpdateSpecialtyResponse> {
    // Verificar se a especialidade existe
    const existingSpecialty = await this.specialtiesRepository.findById(id);
    if (!existingSpecialty) {
      throw new Error('Especialidade não encontrada');
    }

    // Validar valor
    if (valor <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    const specialty = await this.specialtiesRepository.update(id, valor);

    return { specialty };
  }
}