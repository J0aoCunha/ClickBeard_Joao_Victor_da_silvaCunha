
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateAppointmentUseCase } from "../../../use-cases/factories/make-create-appointment-use-case";

export async function createAppointmentController(request: FastifyRequest, reply: FastifyReply) {
    const createAppointmentBodySchema = z.object({
        barbeiro_especialidade_id: z.number().int().positive("Barbeiro especialidade ID deve ser um número positivo"),
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        hora: z.string().regex(/^\d{2}:\d{2}$/, "Hora deve estar no formato HH:MM"),
    });

    const { barbeiro_especialidade_id, data, hora } = createAppointmentBodySchema.parse(request.body);
    
    // Pegar cliente_id do token JWT
    const cliente_id = Number(request.user.sub);

    try {
        const createAppointmentUseCase = makeCreateAppointmentUseCase();
        const { appointment } = await createAppointmentUseCase.execute({ cliente_id, barbeiro_especialidade_id, data, hora });
        
        return reply.status(201).send({ appointment });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
