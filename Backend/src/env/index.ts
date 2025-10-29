import "dotenv/config"
import {z} from "zod"

const envSchemaValidation = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333)
})

const _env = envSchemaValidation.safeParse(process.env)

if(_env.success === false){
  console.error("Variaveis de ambiente invalidas", _env.error.format)
  throw new Error("Variaveis de ambiente invalidas")
}

const env = _env.data

export {env}