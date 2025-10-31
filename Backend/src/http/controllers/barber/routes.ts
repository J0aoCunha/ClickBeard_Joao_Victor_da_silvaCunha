
import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyAdmin } from "../../middlewares/verify-admin";
import { listBarberSpecialtiesController } from "./list-barber-specialties-controller";
import { searchBarbersController } from "./search-barbers-controller";
import { createBarberController } from "./create-barber-controller";

export async function barberRoutes(app: FastifyInstance) {
    app.post("/barber", { preHandler: [verifyAdmin] }, createBarberController);
    app.get("/barber/:barberId/specialties", { preHandler: [verifyJWT] }, listBarberSpecialtiesController);
    app.get("/barber/search", { preHandler: [verifyJWT] }, searchBarbersController);
}
