
import type { FastifyInstance } from "fastify";
import { authenticateClientController } from "./authenticate-client-controller";
import { registerClientController } from "./register-client-controller";
import { getClientProfileController } from "./get-client-profile-controller";
import { refreshTokenController } from "./refresh-token-controller";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyRefreshToken } from "../../middlewares/verify-refresh-token";

export async function clientRoutes(app: FastifyInstance) {
    app.post("/client/authenticate", authenticateClientController);
    app.post("/client", registerClientController);
    app.post("/client/refresh-token", { preHandler: [verifyRefreshToken] }, refreshTokenController);
    app.get("/me", { preHandler: [verifyJWT] }, getClientProfileController);
}
