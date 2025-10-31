
import { PrismaClientRepository } from "../../repositories/prisma-repositories/prisma-client-repository";
import { GetClientProfileUseCase } from "../get-client-profile";

export function makeGetClientProfileUseCase() {
    const prismaClientRepository = new PrismaClientRepository();
    const getClientProfileUseCase = new GetClientProfileUseCase(prismaClientRepository);

    return getClientProfileUseCase;
}
