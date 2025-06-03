import { SolicitudRepository } from "../../infrastructure/repositories/SolicitudRepository";
import { ISolicitudConflicto } from "../../domain/entities/SolicitudConflicto";

export class SolicitudService {
  private solicitudRepository: SolicitudRepository;

  constructor() {
    this.solicitudRepository = new SolicitudRepository();
  }

  async getEquipmentConflicts(idEquipo: number): Promise<ISolicitudConflicto> {
    try {
      if (!idEquipo || idEquipo <= 0) {
        throw {
          status: 400,
          message: "El ID del equipo debe ser un número positivo válido",
        };
      }

      return await this.solicitudRepository.getEquipmentConflicts(idEquipo);
    } catch (error: any) {
      console.error("Error en SolicitudService.getEquipmentConflicts:", error);

      if (error.status) {
        throw error;
      }

      throw {
        status: 500,
        message: "Error interno del servidor al obtener conflictos de equipo",
      };
    }
  }
}
