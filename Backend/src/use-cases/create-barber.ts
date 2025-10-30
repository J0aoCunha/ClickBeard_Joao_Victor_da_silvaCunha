import type { barbeiros } from "@prisma/client"
import type { IBarberRepository } from "../repositories/DTObarber"

interface CreateBarberUseCaseRequest {
  name: string,
  age: number,
  created_by: number,
}

interface CreateBarberUseCaseResponse{
    barber: barbeiros
}

export class CreateBarberUseCase {

    constructor(private barbersRepository: IBarberRepository){}

    async execute({name, age, created_by}:CreateBarberUseCaseRequest): Promise<CreateBarberUseCaseResponse>{

        const barber = await this.barbersRepository.create({
            nome: name,
            idade: age,
            data_contratacao: new Date(),
            criado_por: created_by
        }, created_by)

       return {barber}

    }
}