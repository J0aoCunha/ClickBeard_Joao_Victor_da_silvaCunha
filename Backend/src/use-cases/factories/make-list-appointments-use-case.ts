import { PrismaAppointmentRepository } from "../../repositories/prisma-repositories/prisma-appointment-repository";
import { ListAppointmentsUseCase } from "../list-appointments";


export function makeListAppointmentsUseCase() {
    const prismaAppointmentRepository = new PrismaAppointmentRepository();
    const listAppointmentsUseCase = new ListAppointmentsUseCase(prismaAppointmentRepository);

    return listAppointmentsUseCase;
}
