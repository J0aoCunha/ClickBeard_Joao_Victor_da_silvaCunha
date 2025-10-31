
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeConnectBarberSpecialtyUseCase } from "../../../use-cases/factories/make-connect-barber-specialty-use-case";

export async function connectBarberSpecialtyController(request: FastifyRequest, reply: FastifyReply) {
    const connectBarberSpecialtyBodySchema = z.object({
        barberId: z.number().int().positive("Barber ID deve ser um número positivo"),
        specialtyId: z.number().int().positive("Specialty ID deve ser um número positivo"),
    });

    try {
        const { barberId, specialtyId } = connectBarberSpecialtyBodySchema.parse(request.body);

        const connectBarberSpecialtyUseCase = makeConnectBarberSpecialtyUseCase();
        const { message } = await connectBarberSpecialtyUseCase.execute({ barbeiro_id: barberId, especialidade_id: specialtyId });
        
        return reply.status(201).send({ message });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ 
                message: "Validation error",
                issues: error.format()
            });
        }
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message });
        }
        throw error;
    }
}
