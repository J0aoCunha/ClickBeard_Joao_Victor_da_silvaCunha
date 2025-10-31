
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCancelAppointmentUseCase } from "../../../use-cases/factories/make-cancel-appointment-use-case";

export async function cancelAppointmentController(request: FastifyRequest, reply: FastifyReply) {
    const cancelAppointmentParamsSchema = z.object({
        appointment_id: z.string().transform(Number),
    });

    const { appointment_id } = cancelAppointmentParamsSchema.parse(request.params);

    // Pegar cliente_id do token JWT
    const cliente_id = Number(request.user.sub);
    const isAdmin = (request.user as any).isAdmin || false;

    try {
        const cancelAppointmentUseCase = makeCancelAppointmentUseCase();
        const { appointment } = await cancelAppointmentUseCase.execute({ 
            appointment_id, 
            cliente_id, 
            isAdmin 
        });

        return reply.status(200).send({ appointment });
    } catch (error) {
        if (error instanceof Error) {
            // 403 se não tiver permissão, 409 para conflitos, 400 para outros erros
            if (error.message.includes('permissão')) {
                return reply.status(403).send({ message: error.message });
            }
            if (error.message.includes('já está cancelado') || error.message.includes('não encontrado')) {
                return reply.status(409).send({ message: error.message });
            }
            return reply.status(400).send({ message: error.message });
        }
        throw error;
    }
}
