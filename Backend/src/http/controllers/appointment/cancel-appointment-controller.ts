
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCancelAppointmentUseCase } from "../../../use-cases/factories/make-cancel-appointment-use-case";

export async function cancelAppointmentController(request: FastifyRequest, reply: FastifyReply) {
    const cancelAppointmentParamsSchema = z.object({
        appointment_id: z.string().transform(Number),
    });

    const { appointment_id } = cancelAppointmentParamsSchema.parse(request.params);

    try {
        const cancelAppointmentUseCase = makeCancelAppointmentUseCase();
        await cancelAppointmentUseCase.execute({ appointment_id });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }

    return reply.status(204).send();
}
