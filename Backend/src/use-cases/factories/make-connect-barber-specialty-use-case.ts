import { PrismaSpecialtiesRepository } from "../../repositories/prisma-repositories/prisma-specialties-repository";
import { PrismaBarberSpecialtiesRepository } from "../../repositories/prisma-repositories/prisma-barber-specialties-repository";
import { ConnectBarberSpecialtyUseCase } from "../connect-barber-specialty";
import { PrismaBarberRespository } from "../../repositories/prisma-repositories/prisma-barber-repository";


export function makeConnectBarberSpecialtyUseCase() {
    const prismaBarberSpecialtiesRepository = new PrismaBarberSpecialtiesRepository();
    const prismaBarberRepository = new PrismaBarberRespository();
    const prismaSpecialtiesRepository = new PrismaSpecialtiesRepository();
    const connectBarberSpecialtyUseCase = new ConnectBarberSpecialtyUseCase(prismaBarberSpecialtiesRepository, prismaBarberRepository, prismaSpecialtiesRepository);

    return connectBarberSpecialtyUseCase;
}
