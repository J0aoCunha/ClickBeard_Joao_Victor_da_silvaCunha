import type { FastifyRequest, FastifyReply } from "fastify";
import { makeListAllAppointmentsUseCase } from "../../../use-cases/factories/make-list-all-appointments-use-case";

export async function listAllAppointmentsController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const listAllAppointmentsUseCase = makeListAllAppointmentsUseCase();
        const { appointments } = await listAllAppointmentsUseCase.execute();
        return reply.status(200).send({ appointments });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(500).send({ message: error.message });
        }
        throw error;
    }
}

