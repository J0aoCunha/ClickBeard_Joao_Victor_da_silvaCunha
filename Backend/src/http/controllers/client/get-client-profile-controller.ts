
import type { FastifyRequest, FastifyReply } from "fastify";
import { makeGetClientProfileUseCase } from "../../../use-cases/factories/make-get-client-profile-use-case";

export async function getClientProfileController(request: FastifyRequest, reply: FastifyReply) {
    try {
    const getClientProfileUseCase = makeGetClientProfileUseCase();

        const profile = await getClientProfileUseCase.execute({ clientId: Number(request.user.sub) });

        return reply.status(200).send(profile);
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(404).send({ message: error.message });
        }
        throw error;
    }
}
