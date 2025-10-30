
import { PrismaAdminRepository } from "@/repositories/prisma-repositories/prisma-admin-repository";
import { RegisterAdminUseCase } from "../../register-admin";

export function makeRegisterAdminUseCase() {
    const prismaAdminRepository = new PrismaAdminRepository();
    const registerAdminUseCase = new RegisterAdminUseCase(prismaAdminRepository);

    return registerAdminUseCase;
}
