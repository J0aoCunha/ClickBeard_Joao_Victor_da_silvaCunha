
import type { FastifyInstance } from "fastify";
import { cancelAppointmentController } from "./cancel-appointment-controller";
import { connectBarberSpecialtyController } from "./connect-barber-specialty-controller";
import { createAppointmentController } from "./create-appointment-controller";
import { listAppointmentsController } from "./list-appointments-controller";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyAdmin } from "../../middlewares/verify-admin";

export async function appointmentRoutes(app: FastifyInstance) {
    app.patch("/appointment/:appointment_id/cancel", cancelAppointmentController);
    app.post("/appointment/connect-barber-specialty", { preHandler: [verifyAdmin] }, connectBarberSpecialtyController);
    app.post("/appointment", { preHandler: [verifyJWT] }, createAppointmentController);
    app.get("/appointment", listAppointmentsController);
}
