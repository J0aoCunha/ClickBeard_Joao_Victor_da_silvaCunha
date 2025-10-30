import type { administradores } from "@prisma/client";
import { hash } from "bcryptjs";
import type { IAdminRepository } from "../repositories/DTOadmin";

interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
}


interface RegisterAdminResponse {
  admin: administradores
}


class RegisterAdminUseCase {
  constructor(private clientsRepository: IAdminRepository ) {}

  async execute({name, email, password}: RegisterAdminRequest): Promise<RegisterAdminResponse> {

    const password_has = await hash(password, 6)

    const clientAlreadyExists = await this.clientsRepository.findByEmail(email);

    if (clientAlreadyExists) {
      throw new Error("Admin already exists");
    }

    const admin = await this.clientsRepository.create({
        nome: name,
        email,
        senha: password_has
    });

    return {
      admin
    };
  }
}

export { RegisterAdminUseCase };