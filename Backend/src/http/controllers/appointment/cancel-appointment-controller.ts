
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCancelAppointmentUseCase } from "../../../use-cases/factories/make-cancel-appointment-use-case";

export async function cancelAppointmentController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const cancelAppointmentParamsSchema = z.object({
            appointment_id: z.string().transform(Number),
        });

        const { appointment_id } = cancelAppointmentParamsSchema.parse(request.params);

        // Pegar cliente_id do token JWT (o middleware já verificou e adicionou isAdmin)
        const userId = Number(request.user?.sub);
        
        if (!userId || isNaN(userId)) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
        
        // Verificar se é admin através do middleware (garantir que seja boolean)
        const isAdmin = (request.user as any)?.isAdmin === true;
        const cliente_id = userId;

        const cancelAppointmentUseCase = makeCancelAppointmentUseCase();
        const { appointment } = await cancelAppointmentUseCase.execute({ 
            appointment_id, 
            cliente_id, 
            isAdmin 
        });

        return reply.status(200).send({ appointment });
    } catch (error) {
        // Tratamento de erros de validação do Zod
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ 
                message: "Parâmetros inválidos",
                errors: error.issues 
            });
        }
        
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
        
        // Erro desconhecido
        console.error('Erro desconhecido ao cancelar agendamento:', error);
        return reply.status(500).send({ message: "Erro interno ao cancelar agendamento" });
    }
}
