import type { FastifyRequest, FastifyReply } from "fastify";
import { PrismaAdminRepository } from "../../repositories/prisma-repositories/prisma-admin-repository";

export async function verifyAdmin(request: FastifyRequest, reply: FastifyReply) {
    try {
        // Primeiro verifica se o JWT é válido
        await request.jwtVerify();
        
        // Verifica se o usuário é um administrador
        const adminId = Number(request.user.sub);
        
        if (!adminId || isNaN(adminId)) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
        
        const adminRepository = new PrismaAdminRepository();
        const admin = await adminRepository.findById(adminId);
        
        if (!admin) {
            return reply.status(403).send({ message: "Forbidden: Only administrators can perform this action" });
        }
    } catch (error) {
        // Se o JWT não foi verificado, retorna 401
        return reply.status(401).send({ message: "Unauthorized" });
    }
}

