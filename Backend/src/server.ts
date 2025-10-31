import { env } from './env/index';
import { app } from "./app";

app.listen({
  port: env.PORT,
  host: "0.0.0.0"
}).then(()=>{
  console.log(`Servidor rodando na porta ${env.PORT}`)
}).catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
})