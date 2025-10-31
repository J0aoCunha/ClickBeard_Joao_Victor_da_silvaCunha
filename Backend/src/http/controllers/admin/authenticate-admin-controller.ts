
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeAuthenticateAdminUseCase } from "../../../use-cases/factories/make-authenticate-admin-use-case";

export async function authenticateAdminController(request: FastifyRequest, reply: FastifyReply) {
    const authenticateAdminBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateAdminBodySchema.parse(request.body);

    try {
        const authenticateAdminUseCase = makeAuthenticateAdminUseCase();
        const { admin } = await authenticateAdminUseCase.execute({ email, password });

        // Gera access token
        const token = await reply.jwtSign({}, {
            sign: {
                sub: admin.id.toString(),
            }
        });

        // Gera e define refresh token em cookie
        await reply.setRefreshToken(admin.id.toString());

        return reply.status(200).send({ token });

    } catch (error) {
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message });
        }
        throw error;
    }
}
