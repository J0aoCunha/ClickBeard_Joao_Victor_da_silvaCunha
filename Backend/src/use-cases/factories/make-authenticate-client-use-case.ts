
import { PrismaClientRepository } from "@/repositories/prisma-repositories/prisma-client-repository";
import { AuthenticateClientUseCase } from "../../authenticate-client";

export function makeAuthenticateClientUseCase() {
    const prismaClientRepository = new PrismaClientRepository();
    const authenticateClientUseCase = new AuthenticateClientUseCase(prismaClientRepository);

    return authenticateClientUseCase;
}
