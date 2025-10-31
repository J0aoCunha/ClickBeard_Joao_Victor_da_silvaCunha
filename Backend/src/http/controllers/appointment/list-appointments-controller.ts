
import type { FastifyRequest, FastifyReply } from "fastify";
import { makeListAppointmentsUseCase } from "../../../use-cases/factories/make-list-appointments-use-case";

export async function listAppointmentsController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const listAppointmentsUseCase = makeListAppointmentsUseCase();
        const { appointments } = await listAppointmentsUseCase.execute();
        return reply.status(200).send(appointments);
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(500).send({ message: error.message });
        }
        throw error;
    }
}
