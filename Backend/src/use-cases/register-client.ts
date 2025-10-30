import type { clientes } from "@prisma/client";
import type { IClientRepository } from "../repositories/DTOclient";
import { hash } from "bcryptjs";

interface RegisterClientRequest {
  name: string;
  email: string;
  password: string;
}


interface RegisterClientResponse {
  cliente: clientes
}


class RegisterClientUseCase {
  constructor(private clientsRepository: IClientRepository ) {}

  async execute({name, email, password}: RegisterClientRequest): Promise<RegisterClientResponse> {

    const password_has = await hash(password, 6)

    const clientAlreadyExists = await this.clientsRepository.findByEmail(email);

    if (clientAlreadyExists) {
      throw new Error("Client already exists");
    }

    const cliente = await this.clientsRepository.create({
        nome: name,
        email,
        senha: password_has
    });

    return {
      cliente
    };
  }
}

export { RegisterClientUseCase };