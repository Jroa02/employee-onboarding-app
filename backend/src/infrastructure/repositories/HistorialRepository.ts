import { getPool } from "../database/connection";
import { IHistorialRepository } from "../../domain/repositories/IHistorialRepository";
import { IHistorialAsignacion } from "../../domain/entities/HistorialAsignacion";
import { toColombianTime } from "../../application/utils/dateUtils";

export class HistorialRepository implements IHistorialRepository {
  private client = getPool();

  async getEquipmentAssignmentHistory(
    equipoId: number
  ): Promise<IHistorialAsignacion[]> {
    try {
      const query = `SELECT * FROM public.historial_asignaciones WHERE equipo_id = $1 ORDER BY id ASC`;

      const result = await this.client.query(query, [equipoId]);

      if (!result.rows || result.rows.length === 0) {
        throw {
          status: 404,
          message: `No se encontró historial de asignaciones para el equipo con ID ${equipoId}`,
        };
      }

      return this.mapRowsToHistorialAsignacion(result.rows);
    } catch (error: any) {
      console.error(
        "Error en HistorialRepository.getEquipmentAssignmentHistory:",
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

  private mapRowsToHistorialAsignacion(rows: any[]): IHistorialAsignacion[] {
    return rows.map((row) => ({
      id: row.id,
      equipo_id: row.equipo_id,
      usuario_id: row.usuario_id,
      usuario_nombre: row.usuario_nombre,
      usuario_email: row.usuario_email,
      accion: row.accion,
      fecha_accion: toColombianTime(row.fecha_accion),
      fecha_devolucion: row.fecha_devolucion
        ? toColombianTime(row.fecha_devolucion)
        : null,
      observaciones: row.observaciones || null,
      ejecutado_por_ti_id: row.ejecutado_por_ti_id || null,
    }));
  }
}
