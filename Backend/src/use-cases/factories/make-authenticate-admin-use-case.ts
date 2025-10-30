
import { PrismaAdminRepository } from "@/repositories/prisma-repositories/prisma-admin-repository";
import { AuthenticateAdminUseCase } from "../../authenticate-admin";

export function makeAuthenticateAdminUseCase() {
    const prismaAdminRepository = new PrismaAdminRepository();
    const authenticateAdminUseCase = new AuthenticateAdminUseCase(prismaAdminRepository);

    return authenticateAdminUseCase;
}
