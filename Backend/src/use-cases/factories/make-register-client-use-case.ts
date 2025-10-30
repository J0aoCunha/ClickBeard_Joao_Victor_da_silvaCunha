
import { PrismaClientRepository } from "@/repositories/prisma-repositories/prisma-client-repository";
import { RegisterClientUseCase } from "../register-client";

export function makeRegisterClientUseCase() {
    const prismaClientRepository = new PrismaClientRepository();
    const registerClientUseCase = new RegisterClientUseCase(prismaClientRepository);

    return registerClientUseCase;
}
