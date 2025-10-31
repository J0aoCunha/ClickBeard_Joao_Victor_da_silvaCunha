
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeRegisterClientUseCase } from "../../../use-cases/factories/make-register-client-use-case";

export async function registerClientController(request: FastifyRequest, reply: FastifyReply) {
    const registerClientBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerClientBodySchema.parse(request.body);

    try {
        const registerClientUseCase = makeRegisterClientUseCase();
        await registerClientUseCase.execute({ name, email, password });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }

    return reply.status(201).send();
}
