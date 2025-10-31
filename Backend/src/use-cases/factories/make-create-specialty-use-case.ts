
import { PrismaSpecialtiesRepository } from "../../repositories/prisma-repositories/prisma-specialties-repository";
import { CreateSpecialtyUseCase } from "../create-specialty";

export function makeCreateSpecialtyUseCase() {
    const prismaSpecialtiesRepository = new PrismaSpecialtiesRepository();
    const createSpecialtyUseCase = new CreateSpecialtyUseCase(prismaSpecialtiesRepository);

    return createSpecialtyUseCase;
}
