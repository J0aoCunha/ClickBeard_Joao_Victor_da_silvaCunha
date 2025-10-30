
import { PrismaBarberRepository } from "@/repositories/prisma-repositories/prisma-barber-repository";
import { CreateBarberUseCase } from "../../create-barber";

export function makeCreateBarberUseCase() {
    const prismaBarberRepository = new PrismaBarberRepository();
    const createBarberUseCase = new CreateBarberUseCase(prismaBarberRepository);

    return createBarberUseCase;
}
