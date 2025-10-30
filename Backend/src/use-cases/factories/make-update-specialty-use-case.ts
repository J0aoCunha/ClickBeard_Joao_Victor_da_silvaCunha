
import { PrismaSpecialtiesRepository } from "@/repositories/prisma-repositories/prisma-specialties-repository";
import { UpdateSpecialtyUseCase } from "../../update-specialty";

export function makeUpdateSpecialtyUseCase() {
    const prismaSpecialtiesRepository = new PrismaSpecialtiesRepository();
    const updateSpecialtyUseCase = new UpdateSpecialtyUseCase(prismaSpecialtiesRepository);

    return updateSpecialtyUseCase;
}
