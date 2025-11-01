
import type { FastifyInstance } from "fastify";
import { updateSpecialtyController } from "./update-specialty-controller";
import { createSpecialtyController } from "./create-specialty-controller";
import { listAllSpecialtiesController } from "./list-all-specialties-controller";
import { verifyAdmin } from "../../middlewares/verify-admin";

export async function specialtyRoutes(app: FastifyInstance) {
    app.get("/specialty", { preHandler: [verifyAdmin] }, listAllSpecialtiesController);
    app.put("/specialty/:id", { preHandler: [verifyAdmin] }, updateSpecialtyController);
    app.post("/specialty", { preHandler: [verifyAdmin] }, createSpecialtyController);
}
