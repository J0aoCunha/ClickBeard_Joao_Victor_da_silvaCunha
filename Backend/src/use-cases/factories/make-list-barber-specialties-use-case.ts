
import { PrismaBarberSpecialtiesRepository } from "@/repositories/prisma-repositories/prisma-barber-specialties-repository";
import { ListBarberSpecialtiesUseCase } from "../../list-barber-specialties";

export function makeListBarberSpecialtiesUseCase() {
    const prismaBarberSpecialtiesRepository = new PrismaBarberSpecialtiesRepository();
    const listBarberSpecialtiesUseCase = new ListBarberSpecialtiesUseCase(prismaBarberSpecialtiesRepository);

    return listBarberSpecialtiesUseCase;
}
