
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeRegisterAdminUseCase } from "../../../use-cases/factories/make-register-admin-use-case";

export async function registerAdminController(request: FastifyRequest, reply: FastifyReply) {
    const registerAdminBodySchema = z.object({
        name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
        email: z.string().email("Email inválido").max(100, "Email deve ter no máximo 100 caracteres"),
        password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(255, "Senha deve ter no máximo 255 caracteres"),
    });

    const { name, email, password } = registerAdminBodySchema.parse(request.body);

    try {
        const registerAdminUseCase = makeRegisterAdminUseCase();
        const { admin } = await registerAdminUseCase.execute({ name, email, password });
        
        // Remove a senha antes de retornar
        const { senha, ...adminWithoutPassword } = admin;
        
        return reply.status(201).send({ admin: adminWithoutPassword });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
