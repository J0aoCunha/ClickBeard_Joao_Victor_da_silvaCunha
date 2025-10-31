
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateSpecialtyUseCase } from "../../../use-cases/factories/make-create-specialty-use-case";

export async function createSpecialtyController(request: FastifyRequest, reply: FastifyReply) {
    const createSpecialtyBodySchema = z.object({
        name: z.string(),
        value: z.number(),
        duration_minutes: z.number(),
    });

    const { name, value, duration_minutes } = createSpecialtyBodySchema.parse(request.body);

    try {
        const createSpecialtyUseCase = makeCreateSpecialtyUseCase();
        await createSpecialtyUseCase.execute({ name, value, duration_minutes });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }

    return reply.status(201).send();
}
