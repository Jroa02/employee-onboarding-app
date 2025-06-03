import { getPool } from "../database/connection";
import { ISolicitudRepository } from "../../domain/repositories/ISolicitudRepository";
import { ISolicitudConflicto } from "../../domain/entities/SolicitudConflicto";

export class SolicitudRepository implements ISolicitudRepository {
  private client = getPool();

  async getEquipmentConflicts(idEquipo: number): Promise<ISolicitudConflicto> {
    try {
      const query = `SELECT verificar_conflictos_equipo($1) as conflictos_data`;

      const result = await this.client.query(query, [idEquipo]);

      if (!result.rows || result.rows.length === 0) {
        throw {
          status: 404,
          message: `No se encontraron datos para el equipo con ID ${idEquipo}`,
        };
      }

      const conflictosData = result.rows[0].conflictos_data;

      // The function returns JSON data, so we need to parse it
      if (typeof conflictosData === "string") {
        return JSON.parse(conflictosData);
      }

      return conflictosData;
    } catch (error: any) {
      console.error(
        "Error en SolicitudRepository.getEquipmentConflicts:",
        error
      );

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
