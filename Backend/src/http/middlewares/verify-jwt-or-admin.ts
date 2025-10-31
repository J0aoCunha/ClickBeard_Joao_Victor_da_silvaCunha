import type { FastifyRequest, FastifyReply } from "fastify";
import { PrismaAdminRepository } from "../../repositories/prisma-repositories/prisma-admin-repository";

// Middleware que permite tanto clientes quanto admins
// Adiciona isAdmin ao request.user
export async function verifyJWTOrAdmin(request: FastifyRequest, reply: FastifyReply) {
    try {
        // Verifica se o JWT é válido
        await request.jwtVerify();
        
        const userId = Number(request.user.sub);
        
        if (!userId || isNaN(userId)) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
        
        // Verifica se é admin
        const adminRepository = new PrismaAdminRepository();
        const admin = await adminRepository.findById(userId);
        
        // Adiciona informação se é admin ao request.user
        (request.user as any).isAdmin = !!admin;
        (request.user as any).userId = userId;
        
    } catch (error) {
        return reply.status(401).send({ message: "Unauthorized" });
    }
}
