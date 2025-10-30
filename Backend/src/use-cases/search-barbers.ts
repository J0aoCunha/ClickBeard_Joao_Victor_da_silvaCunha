import type { barbeiros } from "@prisma/client"
import type { IBarberRepository } from "../repositories/DTObarber"

interface SearchBarbersUseCaseRequest {}

interface SearchBarbersUseCaseResponse{
    barbers: barbeiros[]
}

export class SearchBarbersUseCase {

    constructor(private barberRepository: IBarberRepository){}

    async execute({}:SearchBarbersUseCaseRequest): Promise<SearchBarbersUseCaseResponse>{

        const barbers = await this.barberRepository.list()
        
        return {barbers}

    }
}