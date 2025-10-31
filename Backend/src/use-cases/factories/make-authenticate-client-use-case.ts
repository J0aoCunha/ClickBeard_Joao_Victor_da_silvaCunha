import { PrismaClientRepository } from "../../repositories/prisma-repositories/prisma-client-repository";
import { AuthenticateUseCase } from "../authenticate-client";


export function makeAuthenticateClientUseCase() {
    const prismaClientRepository = new PrismaClientRepository();
    const authenticateCase = new AuthenticateUseCase(prismaClientRepository);

    return authenticateCase;
}
