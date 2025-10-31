import { compare } from "bcryptjs";
import type { IClientRepository } from "../repositories/DTOclient";
import type { clientes } from "@prisma/client";

interface AuthenticateClientUseCaseRequest{
    email: string,
    password:string
}

interface  AuthenticateClientUseCaseResponse {
    client: clientes
}


export class AuthenticateUseCase{
    constructor(
        private clientsRepository: IClientRepository
    ){}

    async execute({email, password}:AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse>{

        const client = await this.clientsRepository.findByEmail(email)

        if(!client){
            throw new Error("User not found")
        }

        const password_hash = client.senha
        const doesPasswordMatches = await compare(password, password_hash)

        if(!doesPasswordMatches){
            throw new Error("User not found")
        }

        return {client}
    }
}