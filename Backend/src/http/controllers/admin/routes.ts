
import type { FastifyInstance } from "fastify";
import { authenticateAdminController } from "./authenticate-admin-controller";
import { registerAdminController } from "./register-admin-controller";

export async function adminRoutes(app: FastifyInstance) {
    app.post("/admin/authenticate", authenticateAdminController);
    app.post("/admin", registerAdminController);
}
