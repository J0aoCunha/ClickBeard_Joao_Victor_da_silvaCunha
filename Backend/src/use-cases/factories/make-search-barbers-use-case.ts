
import { PrismaBarberRepository } from "@/repositories/prisma-repositories/prisma-barber-repository";
import { SearchBarbersUseCase } from "../../search-barbers";

export function makeSearchBarbersUseCase() {
    const prismaBarberRepository = new PrismaBarberRepository();
    const searchBarbersUseCase = new SearchBarbersUseCase(prismaBarberRepository);

    return searchBarbersUseCase;
}
