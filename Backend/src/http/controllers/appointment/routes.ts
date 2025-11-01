
import type { FastifyInstance } from "fastify";
import { cancelAppointmentController } from "./cancel-appointment-controller";
import { connectBarberSpecialtyController } from "./connect-barber-specialty-controller";
import { createAppointmentController } from "./create-appointment-controller";
import { listAppointmentsController } from "./list-appointments-controller";
import { listAllAppointmentsController } from "./list-all-appointments-controller";
import { getOccupiedTimesController } from "./get-occupied-times-controller";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyAdmin } from "../../middlewares/verify-admin";
import { verifyJWTOrAdmin } from "../../middlewares/verify-jwt-or-admin";

export async function appointmentRoutes(app: FastifyInstance) {
    app.patch("/appointment/:appointment_id/cancel", { preHandler: [verifyJWTOrAdmin] }, cancelAppointmentController);
    app.post("/appointment/connect-barber-specialty", { preHandler: [verifyAdmin] }, connectBarberSpecialtyController);
    app.post("/appointment", { preHandler: [verifyJWT] }, createAppointmentController);
    app.get("/appointment", { preHandler: [verifyJWT] }, listAppointmentsController);
    app.get("/appointment/all", { preHandler: [verifyAdmin] }, listAllAppointmentsController);
    app.get("/appointment/occupied-times", { preHandler: [verifyJWT] }, getOccupiedTimesController);
}
