import '@fastify/jwt';

declare module '@fastify/jwt'{
 export interface FastifyJWT{
        user:{
           sub: string,
        }
   }
}

declare module 'fastify' {
  interface FastifyReply {
    setRefreshToken(userId: string): Promise<void>;
  }
}