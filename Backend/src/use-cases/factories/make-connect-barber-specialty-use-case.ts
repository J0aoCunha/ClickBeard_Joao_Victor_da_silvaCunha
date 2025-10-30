
import { PrismaBarberSpecialtiesRepository } from "@/repositories/prisma-repositories/prisma-barber-specialties-repository";
import { ConnectBarberSpecialtyUseCase } from "../../connect-barber-specialty";

export function makeConnectBarberSpecialtyUseCase() {
    const prismaBarberSpecialtiesRepository = new PrismaBarberSpecialtiesRepository();
    const connectBarberSpecialtyUseCase = new ConnectBarberSpecialtyUseCase(prismaBarberSpecialtiesRepository);

    return connectBarberSpecialtyUseCase;
}
