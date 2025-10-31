
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeAuthenticateClientUseCase } from "../../../use-cases/factories/make-authenticate-client-use-case";

export async function authenticateClientController(request: FastifyRequest, reply: FastifyReply) {
    const authenticateClientBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateClientBodySchema.parse(request.body);

    try {
        const authenticateClientUseCase = makeAuthenticateClientUseCase();
        const { client } = await authenticateClientUseCase.execute({ email, password });

        const token = await reply.jwtSign({}, {
            sign: {
                sub: client.id.toString(),
            }
        });

        return reply.status(200).send({ token });

    } catch (error) {
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message });
        }
        throw error;
    }
}
