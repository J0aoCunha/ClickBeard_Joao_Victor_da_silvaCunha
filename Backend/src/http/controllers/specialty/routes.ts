
import type { FastifyInstance } from "fastify";
import { updateSpecialtyController } from "./update-specialty-controller";
import { createSpecialtyController } from "./create-specialty-controller";
import { verifyAdmin } from "../../middlewares/verify-admin";

export async function specialtyRoutes(app: FastifyInstance) {
    app.put("/specialty/:id", { preHandler: [verifyAdmin] }, updateSpecialtyController);
    app.post("/specialty", { preHandler: [verifyAdmin] }, createSpecialtyController);
}
