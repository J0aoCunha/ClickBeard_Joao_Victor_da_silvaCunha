import { PrismaSpecialtiesRepository } from "../../repositories/prisma-repositories/prisma-specialties-repository";
import { ListAllSpecialtiesUseCase } from "../list-all-specialties";

export function makeListAllSpecialtiesUseCase() {
    const prismaSpecialtiesRepository = new PrismaSpecialtiesRepository();
    const listAllSpecialtiesUseCase = new ListAllSpecialtiesUseCase(prismaSpecialtiesRepository);

    return listAllSpecialtiesUseCase;
}
