import { PrismaAppointmentRepository } from "../../repositories/prisma-repositories/prisma-appointment-repository";
import { GetOccupiedTimesUseCase } from "../get-occupied-times";

export function makeGetOccupiedTimesUseCase() {
    const prismaAppointmentRepository = new PrismaAppointmentRepository();
    const getOccupiedTimesUseCase = new GetOccupiedTimesUseCase(prismaAppointmentRepository);

    return getOccupiedTimesUseCase;
}
