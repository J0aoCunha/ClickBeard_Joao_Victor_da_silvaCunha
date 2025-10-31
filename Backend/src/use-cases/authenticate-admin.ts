import { compare } from "bcryptjs";
import type { IAdminRepository } from "../repositories/DTOadmin";
import type { administradores } from "@prisma/client";

interface AuthenticateAdminUseCaseRequest{
    email: string,
    password:string
}

interface  AuthenticateAdminUseCaseResponse {
    admin: administradores
}

class AuthenticateAdminUseCase{
    constructor(
        private adminRepository: IAdminRepository
    ){}

    async execute({email, password}:AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse>{

        const admin = await this.adminRepository.findByEmail(email)

        if(!admin){
            throw new Error("User not found")
        }

        const password_hash = admin.senha
        const doesPasswordMatches = await compare(password, password_hash)

        if(!doesPasswordMatches){
            throw new Error("User not found")
        }

        return {admin}
    }
}

export { AuthenticateAdminUseCase };