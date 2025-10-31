import type { FastifyRequest, FastifyReply } from "fastify";

export async function refreshTokenController(request: FastifyRequest, reply: FastifyReply) {
    try {
        // O token é verificado pelo middleware verifyRefreshToken
        const userId = Number(request.user.sub);
        
        if (!userId || isNaN(userId)) {
            return reply.status(401).send({ message: "Unauthorized" });
        }

        // Gera um novo access token
        const token = await reply.jwtSign({}, {
            sign: {
                sub: userId.toString(),
            }
        });

        // Renova o refresh token também
        await reply.setRefreshToken(userId.toString());

        return reply.status(200).send({ token });
    } catch (error) {
        return reply.status(401).send({ message: "Unauthorized" });
    }
}
