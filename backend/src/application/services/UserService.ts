import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import {
  CreateUserRequest,
  UserByEstado,
} from "../../domain/repositories/IUserRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: CreateUserRequest): Promise<void> {
    // Validaciones de negocio
    if (!userData.nombre || userData.nombre.trim().length === 0) {
      throw {
        message: "El nombre es requerido",
        status: 400,
      };
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw {
        message: "Email inválido",
        status: 400,
      };
    }

    if (!userData.area || userData.area.trim().length === 0) {
      throw {
        message: "El área es requerida",
        status: 400,
      };
    }

    if (!userData.rol || userData.rol.trim().length === 0) {
      throw {
        message: "El rol es requerido",
        status: 400,
      };
    }

    if (!userData.lider_solicitante_id || userData.lider_solicitante_id <= 0) {
      throw {
        message: "ID de líder inválido",
        status: 400,
      };
    }

    return await this.userRepository.createUser(userData);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getUsersByLeaderAndEstado(
    idLider: number,
    estado: string
  ): Promise<UserByEstado[]> {
    // Validaciones de negocio
    if (!idLider || idLider <= 0) {
      throw {
        message: "ID de líder inválido",
        status: 400,
      };
    }

    // Validar que el estado sea válido según el OAS
    const validEstados = ["pendiente", "aprobado", "rechazado"];

    if (!validEstados.includes(estado)) {
      throw {
        message: `Estado inválido. Los estados válidos son: ${validEstados.join(
          ", "
        )}`,
        status: 400,
      };
    }

    return await this.userRepository.getUsersByLeaderAndEstado(idLider, estado);
  }
}
