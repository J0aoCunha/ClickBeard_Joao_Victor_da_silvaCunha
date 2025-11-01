import type { FastifyRequest, FastifyReply } from "fastify";
import { makeListAllSpecialtiesUseCase } from "../../../use-cases/factories/make-list-all-specialties-use-case";

export async function listAllSpecialtiesController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const listAllSpecialtiesUseCase = makeListAllSpecialtiesUseCase();
        const { specialties } = await listAllSpecialtiesUseCase.execute();
        return reply.status(200).send({ specialties });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(500).send({ message: error.message });
        }
        throw error;
    }
}
