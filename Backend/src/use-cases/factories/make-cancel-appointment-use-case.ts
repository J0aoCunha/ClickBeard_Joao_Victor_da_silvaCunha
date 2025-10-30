
import { PrismaAppointmentRepository } from "@/repositories/prisma-repositories/prisma-appointment-repository";
import { CancelAppointmentUseCase } from "../../cancel-appointment";

export function makeCancelAppointmentUseCase() {
    const prismaAppointmentRepository = new PrismaAppointmentRepository();
    const cancelAppointmentUseCase = new CancelAppointmentUseCase(prismaAppointmentRepository);

    return cancelAppointmentUseCase;
}
