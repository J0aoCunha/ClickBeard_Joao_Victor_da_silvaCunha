import fastify from "fastify";
import { adminRoutes } from "./http/controllers/admin/routes";
import { clientRoutes } from "./http/controllers/client/routes";
import { barberRoutes } from "./http/controllers/barber/routes";
import { specialtyRoutes } from "./http/controllers/specialty/routes";
import { appointmentRoutes } from "./http/controllers/appointment/routes";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import { env } from "./env";
import { ZodError } from "zod";

const app = fastify();

app.register(fastifyCors, {
  origin: true, // Permite todas as origens (em produção, especifique as origens permitidas)
  credentials: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "10m",
  },
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
})

app.register(adminRoutes);
app.register(clientRoutes);
app.register(barberRoutes);
app.register(specialtyRoutes);
app.register(appointmentRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.format(),
    })
  }

  // Log detalhado em desenvolvimento
  if(env.NODE_ENV === "dev") {
    console.error("Erro detalhado:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  }

  // Log simples em produção (sem stack trace)
  if(env.NODE_ENV === "production") {
    console.error("Erro:", error.message);
  } 


  return reply.status(500).send({
    message: "Internal server error",
    error: env.NODE_ENV === "dev" ? error.message : "Algo deu errado. Tente novamente mais tarde.",
  })
})


export {app}
