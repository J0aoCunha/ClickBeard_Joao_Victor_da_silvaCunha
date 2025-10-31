
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateSpecialtyUseCase } from "../../../use-cases/factories/make-create-specialty-use-case";

export async function createSpecialtyController(request: FastifyRequest, reply: FastifyReply) {
    const createSpecialtyBodySchema = z.object({
        name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
        value: z.number().int("Valor deve ser um número inteiro").positive("Valor deve ser positivo"),
        duration_minutes: z.number().int("Duração deve ser um número inteiro").positive("Duração deve ser positiva").min(15, "Duração mínima é 15 minutos"),
    });

    const { name, value, duration_minutes } = createSpecialtyBodySchema.parse(request.body);

    try {
        const createSpecialtyUseCase = makeCreateSpecialtyUseCase();
        const { specialty } = await createSpecialtyUseCase.execute({ name, value, duration_minutes });
        
        return reply.status(201).send({ specialty });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
