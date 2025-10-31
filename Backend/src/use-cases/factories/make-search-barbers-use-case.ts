import { PrismaBarberRespository } from "../../repositories/prisma-repositories/prisma-barber-repository";
import { SearchBarbersUseCase } from "../search-barbers";


export function makeSearchBarbersUseCase() {
    const prismaBarberRepository = new PrismaBarberRespository();
    const searchBarbersUseCase = new SearchBarbersUseCase(prismaBarberRepository);

    return searchBarbersUseCase;
}
