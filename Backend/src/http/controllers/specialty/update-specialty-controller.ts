
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateSpecialtyUseCase } from "../../../use-cases/factories/make-update-specialty-use-case";

export async function updateSpecialtyController(request: FastifyRequest, reply: FastifyReply) {
    const updateSpecialtyParamsSchema = z.object({
        id: z.string().transform(Number)
    });
    const updateSpecialtyBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        duration_minutes: z.number().optional(),
    });

    const { id } = updateSpecialtyParamsSchema.parse(request.params);
    const data = updateSpecialtyBodySchema.parse(request.body);

    try {
        const updateSpecialtyUseCase = makeUpdateSpecialtyUseCase();
        await updateSpecialtyUseCase.execute({ specialtyId: id, data });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message });
        }
        throw error;
    }

    return reply.status(204).send();
}
