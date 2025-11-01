
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSearchBarbersUseCase } from "../../../use-cases/factories/make-search-barbers-use-case";

export async function searchBarbersController(request: FastifyRequest, reply: FastifyReply) {
    const searchBarbersQuerySchema = z.object({
        query: z.string().max(100, "Query de busca deve ter no máximo 100 caracteres").optional(),
    });

    const queryParams = searchBarbersQuerySchema.parse(request.query);
    const query = queryParams.query || "";

    const searchBarbersUseCase = makeSearchBarbersUseCase();
    const { barbers } = await searchBarbersUseCase.execute({ query });

    return reply.status(200).send({ barbers });
}
