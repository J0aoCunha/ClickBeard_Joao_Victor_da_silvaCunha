import { PrismaBarberRespository } from "../../repositories/prisma-repositories/prisma-barber-repository";
import { CreateBarberUseCase } from "../create-barber";

export function makeCreateBarberUseCase() {
    const prismaBarberRepository = new PrismaBarberRespository();
    const createBarberUseCase = new CreateBarberUseCase(prismaBarberRepository);

    return createBarberUseCase;
}
