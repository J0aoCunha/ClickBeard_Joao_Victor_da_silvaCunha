import { compare } from "bcryptjs";
import type { IClientRepository } from "../repositories/DTOclient";
import type { clientes } from "@prisma/client";

interface AuthenticateClientUseCaseRequest{
    email: string,
    password:string
}

interface  AuthenticateClientUseCaseResponse {
    cliente: clientes
}


export class AuthenticateUseCase{
    constructor(
        private clientsRepository: IClientRepository
    ){}

    async execute({email, password}:AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse>{

        const cliente = await this.clientsRepository.findByEmail(email)

        if(!cliente){
            throw new Error("User not found")
        }

        const password_hash = cliente.senha
        const doesPasswordMatches = await compare(password, password_hash)

        if(!doesPasswordMatches){
            throw new Error("User not found")
        }

        return {cliente}
    }
}