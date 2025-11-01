import { PrismaAppointmentRepository } from "../../repositories/prisma-repositories/prisma-appointment-repository";
import { ListAllAppointmentsUseCase } from "../list-all-appointments";

export function makeListAllAppointmentsUseCase() {
    const prismaAppointmentRepository = new PrismaAppointmentRepository();
    const listAllAppointmentsUseCase = new ListAllAppointmentsUseCase(prismaAppointmentRepository);

    return listAllAppointmentsUseCase;
}

