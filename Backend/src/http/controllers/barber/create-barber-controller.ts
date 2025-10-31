
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateBarberUseCase } from "../../../use-cases/factories/make-create-barber-use-case";

export async function createBarberController(request: FastifyRequest, reply: FastifyReply) {
    const createBarberBodySchema = z.object({
        name: z.string(),
        idade: z.number().min(18),
    });

    const { name, idade } = createBarberBodySchema.parse(request.body);

    try {
        const createBarberUseCase = makeCreateBarberUseCase();
        await createBarberUseCase.execute({ age: idade, name, created_by: Number(request.user.sub) });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }

    return reply.status(201).send();
}
