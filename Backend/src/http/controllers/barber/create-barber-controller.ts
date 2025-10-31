
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateBarberUseCase } from "../../../use-cases/factories/make-create-barber-use-case";

export async function createBarberController(request: FastifyRequest, reply: FastifyReply) {
    const createBarberBodySchema = z.object({
        name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
        idade: z.number().int("Idade deve ser um número inteiro").min(18, "Barbeiro deve ter no mínimo 18 anos").max(100, "Idade inválida"),
    });

    const { name, idade } = createBarberBodySchema.parse(request.body);

    try {
        const createBarberUseCase = makeCreateBarberUseCase();
        const { barber } = await createBarberUseCase.execute({ age: idade, name, created_by: Number(request.user.sub) });
        
        return reply.status(201).send({ barber });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
