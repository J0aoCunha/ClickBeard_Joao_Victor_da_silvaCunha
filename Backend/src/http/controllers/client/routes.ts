
import type { FastifyInstance } from "fastify";
import { authenticateClientController } from "./authenticate-client-controller";
import { registerClientController } from "./register-client-controller";
import { getClientProfileController } from "./get-client-profile-controller";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function clientRoutes(app: FastifyInstance) {
    app.post("/client/authenticate", authenticateClientController);
    app.post("/client", registerClientController);
    app.get("/me", { preHandler: [verifyJWT] }, getClientProfileController);
}
