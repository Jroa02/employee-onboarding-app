import { HistorialRepository } from "../../infrastructure/repositories/HistorialRepository";
import { IHistorialAsignacion } from "../../domain/entities/HistorialAsignacion";

export class HistorialService {
  private historialRepository: HistorialRepository;

  constructor() {
    this.historialRepository = new HistorialRepository();
  }

  async getEquipmentAssignmentHistory(
    equipoId: number
  ): Promise<IHistorialAsignacion[]> {
    try {
      if (!equipoId || equipoId <= 0) {
        throw {
          status: 400,
          message: "El ID del equipo debe ser un número positivo válido",
        };
      }

      return await this.historialRepository.getEquipmentAssignmentHistory(
        equipoId
      );
    } catch (error: any) {
      console.error(
        "Error en HistorialService.getEquipmentAssignmentHistory:",
        error
      );

      if (error.status) {
        throw error;
      }

      throw {
        status: 500,
        message:
          "Error interno del servidor al obtener historial de asignaciones",
      };
    }
  }
}
