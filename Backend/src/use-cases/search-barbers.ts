import type { barbeiros } from "@prisma/client"
import type { IBarberRepository } from "../repositories/DTObarber"

interface SearchBarbersUseCaseRequest {
    query: string
}

interface SearchBarbersUseCaseResponse{
    barbers: barbeiros[]
}

export class SearchBarbersUseCase {

    constructor(private barberRepository: IBarberRepository){}

    async execute({ query }:SearchBarbersUseCaseRequest): Promise<SearchBarbersUseCaseResponse>{
        const barbers = await this.barberRepository.searchByName(query || "")
        
        return {barbers}

    }
}