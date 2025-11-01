import type { FastifyRequest, FastifyReply } from "fastify";
import { PrismaAdminRepository } from "../../repositories/prisma-repositories/prisma-admin-repository";

// Middleware que permite tanto clientes quanto admins
// Adiciona isAdmin ao request.user
export async function verifyJWTOrAdmin(request: FastifyRequest, reply: FastifyReply) {
    try {
        // Verifica se o JWT é válido
        await request.jwtVerify();
        
        if (!request.user || !request.user.sub) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
        
        const userId = Number(request.user.sub);
        
        if (!userId || isNaN(userId)) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
        
        // Verifica se é admin
        const adminRepository = new PrismaAdminRepository();
        let admin = null;
        
        try {
            admin = await adminRepository.findById(userId);
        } catch (error) {
            // Se não encontrar admin, não é problema, pode ser cliente
            admin = null;
        }
        
        // Adiciona informação se é admin ao request.user (true/false explícito)
        // Garantir que sempre seja um boolean
        (request.user as any).isAdmin = admin !== null ? true : false;
        (request.user as any).userId = userId;
        
    } catch (error) {
        return reply.status(401).send({ message: "Unauthorized" });
    }
}
