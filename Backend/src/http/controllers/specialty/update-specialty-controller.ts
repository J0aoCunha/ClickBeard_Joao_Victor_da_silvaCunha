
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateSpecialtyUseCase } from "../../../use-cases/factories/make-update-specialty-use-case";

export async function updateSpecialtyController(request: FastifyRequest, reply: FastifyReply) {
    const updateSpecialtyParamsSchema = z.object({
        id: z.string().transform(Number)
    });
    const updateSpecialtyBodySchema = z.object({
        value: z.number().int("Valor deve ser um número inteiro").positive("Valor deve ser positivo"),
    });

    const { id } = updateSpecialtyParamsSchema.parse(request.params);
    const { value } = updateSpecialtyBodySchema.parse(request.body);

    try {
        const updateSpecialtyUseCase = makeUpdateSpecialtyUseCase();
        const { specialty } = await updateSpecialtyUseCase.execute({ id, valor: value });
        
        return reply.status(200).send({ specialty });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message });
        }
        throw error;
    }
}
