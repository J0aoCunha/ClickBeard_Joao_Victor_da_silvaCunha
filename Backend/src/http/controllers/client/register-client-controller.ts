
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeRegisterClientUseCase } from "../../../use-cases/factories/make-register-client-use-case";

export async function registerClientController(request: FastifyRequest, reply: FastifyReply) {
    const registerClientBodySchema = z.object({
        name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
        email: z.string().email("Email inválido").max(100, "Email deve ter no máximo 100 caracteres"),
        password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(255, "Senha deve ter no máximo 255 caracteres"),
    });

    const { name, email, password } = registerClientBodySchema.parse(request.body);

    try {
        const registerClientUseCase = makeRegisterClientUseCase();
        const { cliente } = await registerClientUseCase.execute({ name, email, password });
        
        // Remove a senha antes de retornar
        const { senha, ...clientWithoutPassword } = cliente;
        
        return reply.status(201).send({ client: clientWithoutPassword });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
