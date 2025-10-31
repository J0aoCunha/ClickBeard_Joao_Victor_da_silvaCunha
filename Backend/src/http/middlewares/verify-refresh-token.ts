import type { FastifyRequest, FastifyReply } from "fastify";

// Interface estendida para incluir cookies
interface RequestWithCookies extends FastifyRequest {
    cookies: {
        refreshToken?: string;
        [key: string]: string | undefined;
    };
}

// Middleware que verifica o refresh token do cookie
export async function verifyRefreshToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const req = request as RequestWithCookies;
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return reply.status(401).send({ message: "Refresh token não encontrado" });
        }

        // Verifica o token do cookie (o fastify-jwt verifica automaticamente o cookie refreshToken)
        await request.jwtVerify();
        
        // Se chegou aqui, o token é válido
        return;
    } catch (error) {
        return reply.status(401).send({ message: "Refresh token inválido" });
    }
}
