
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSearchBarbersUseCase } from "../../../use-cases/factories/make-search-barbers-use-case";

export async function searchBarbersController(request: FastifyRequest, reply: FastifyReply) {
    const searchBarbersQuerySchema = z.object({
        query: z.string(),
    });

    const { query } = searchBarbersQuerySchema.parse(request.query);

    const searchBarbersUseCase = makeSearchBarbersUseCase();
    const { barbers } = await searchBarbersUseCase.execute({ query });

    return reply.status(200).send({ barbers });
}
