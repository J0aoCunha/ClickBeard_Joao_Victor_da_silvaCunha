import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetOccupiedTimesUseCase } from "../../../use-cases/factories/make-get-occupied-times-use-case";

export async function getOccupiedTimesController(request: FastifyRequest, reply: FastifyReply) {
    const getOccupiedTimesQuerySchema = z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
        barbeiro_id: z.string().transform(Number),
    });

    const queryParams = getOccupiedTimesQuerySchema.parse(request.query);

    try {
        const getOccupiedTimesUseCase = makeGetOccupiedTimesUseCase();
        const { occupiedTimes } = await getOccupiedTimesUseCase.execute({
            date: queryParams.date,
            barbeiro_id: queryParams.barbeiro_id,
        });

        return reply.status(200).send({ occupiedTimes });
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message });
        }
        throw error;
    }
}
