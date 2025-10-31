import { PrismaAppointmentRepository } from "../../repositories/prisma-repositories/prisma-appointment-repository";
import { PrismaBarberSpecialtiesRepository } from "../../repositories/prisma-repositories/prisma-barber-specialties-repository";
import { PrismaSpecialtiesRepository } from "../../repositories/prisma-repositories/prisma-specialties-repository";
import { CreateAppointmentUseCase } from "../create-appointment";



export function makeCreateAppointmentUseCase() {
    const prismaAppointmentRepository = new PrismaAppointmentRepository();
    const prismaBarberSpecialtiesRepository = new PrismaBarberSpecialtiesRepository();
    const prismaSpecialtiesRepository = new PrismaSpecialtiesRepository();
    
    const createAppointmentUseCase = new CreateAppointmentUseCase(
        prismaAppointmentRepository, 
        prismaBarberSpecialtiesRepository, 
        prismaSpecialtiesRepository
    );

    return createAppointmentUseCase;
}
