
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeRegisterAdminUseCase } from "../../../use-cases/factories/make-register-admin-use-case";

export async function registerAdminController(request: FastifyRequest, reply: FastifyReply) {
    const registerAdminBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerAdminBodySchema.parse(request.body);

    try {
        const registerAdminUseCase = makeRegisterAdminUseCase();
        await registerAdminUseCase.execute({ name, email, password });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }

    return reply.status(201).send();
}
