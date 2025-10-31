
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeListBarberSpecialtiesUseCase } from "../../../use-cases/factories/make-list-barber-specialties-use-case";

export async function listBarberSpecialtiesController(request: FastifyRequest, reply: FastifyReply) {
    const listBarberSpecialtiesParamsSchema = z.object({
        barberId: z.string().transform(Number)
    });

    const { barberId } = listBarberSpecialtiesParamsSchema.parse(request.params);

    const listBarberSpecialtiesUseCase = makeListBarberSpecialtiesUseCase();
    const { specialties } = await listBarberSpecialtiesUseCase.execute({ barbeiro_id: barberId });

    return reply.status(200).send({ specialties });
}
