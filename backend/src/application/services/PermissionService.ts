import { PermissionRepository } from "../../infrastructure/repositories/PermissionRepository";
import {
  Permiso,
  SolicitudPermiso,
} from "../../domain/repositories/IPermissionRepository";

export class PermissionService {
  private permissionRepository: PermissionRepository;

  constructor() {
    this.permissionRepository = new PermissionRepository();
  }

  async getPermissionsByCategory(categoria: string): Promise<Permiso[]> {
    // Validar que la categoría sea válida según el OAS
    const validCategories = [
      "Desarrollo",
      "Infrastructura",
      "Pruebas",
      "Agile",
    ];

    if (!validCategories.includes(categoria)) {
      throw {
        message: `Categoría inválida. Las categorías válidas son: ${validCategories.join(
          ", "
        )}`,
        status: 400,
      };
    }

    return await this.permissionRepository.getPermissionsByCategory(categoria);
  }

  async createPermissionRequest(solicitud: SolicitudPermiso): Promise<void> {
    // Validaciones de negocio
    if (!solicitud.usuario_id || solicitud.usuario_id <= 0) {
      throw {
        message: "ID de usuario inválido",
        status: 400,
      };
    }

    if (!solicitud.permiso_id || solicitud.permiso_id <= 0) {
      throw {
        message: "ID de permiso inválido",
        status: 400,
      };
    }

    if (
      !solicitud.lider_solicitante_id ||
      solicitud.lider_solicitante_id <= 0
    ) {
      throw {
        message: "ID de líder solicitante inválido",
        status: 400,
      };
    }

    return await this.permissionRepository.createPermissionRequest(solicitud);
  }
  async getPermissionById(id: number): Promise<Permiso> {
    // Validación del ID
    if (!id || id <= 0) {
      throw {
        message: "ID de solicitud de acceso inválido",
        status: 400,
      };
    }

    return await this.permissionRepository.getPermissionById(id);
  }
}
