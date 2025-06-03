import {
  ITIRepository,
  ITIUserRequest,
  ITIUser,
  IProcessRequestData,
} from "../../domain/repositories/ITIRepository";
import { getPool } from "../database/connection";
import { toColombianTime } from "../../application/utils/dateUtils";

export class TIRepository implements ITIRepository {
  private client = getPool();

  private validateRowCount(result: any, message: object) {
    if (result.rowCount === 0) {
      throw message;
    }
  }
  async getAllRequestsByType(tipoSolicitud: string): Promise<ITIUserRequest[]> {
    try {
      const query = `SELECT * FROM public.vista_todas_solicitudes WHERE tipo_solicitud = $1`;

      const result = await this.client.query(query, [tipoSolicitud]);
      this.validateRowCount(result, {
        message: `No se encontraron solicitudes de ${tipoSolicitud}.`,
        status: 404,
      });

      // Mapear resultados
      return this.mapRowsToTIUserRequest(result.rows);
    } catch (error: any) {
      throw error;
    }
  }
  private mapRowsToTIUserRequest(rows: any[]): ITIUserRequest[] {
    return rows.map((row) => {
      return {
        lider_id: row.lider_id,
        lider_nombre: row.lider_nombre,
        lider_area: row.lider_area,
        tipo_solicitud: row.tipo_solicitud,
        solicitud_id: row.solicitud_id,
        beneficiario_id: row.beneficiario_id,
        beneficiario_nombre: row.beneficiario_nombre,
        beneficiario_email: row.beneficiario_email,
        beneficiario_area: row.beneficiario_area,
        beneficiario_rol: row.beneficiario_rol,
        estado: row.estado,
        fecha_solicitud: toColombianTime(row.fecha_solicitud) || "",
        fecha_respuesta: toColombianTime(row.fecha_respuesta),
        procesado_por_ti_id: row.procesado_por_ti_id || null,
        procesado_por_ti: row.procesado_por_ti || null,
        especialidad_ti: row.especialidad_ti || null,
        observaciones_ti: row.observaciones_ti || null,
      };
    });
  }

  async getUserById(id: number): Promise<ITIUser> {
    try {
      const query = `SELECT * FROM public.personal_ti WHERE id = $1 ORDER BY id ASC`;

      const result = await this.client.query(query, [id]);
      this.validateRowCount(result, {
        message: "Usuario de TI no encontrado.",
        status: 404,
      });

      // Mapear resultado
      return this.mapRowToTIUser(result.rows[0]);
    } catch (error: any) {
      throw error;
    }
  }

  private mapRowToTIUser(row: any): ITIUser {
    return {
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      especialidad: row.especialidad,
      activo: row.activo,
      fecha_creacion: toColombianTime(row.fecha_creacion) || "",
    };
  }

  async processRequest(
    tipoSolicitud: string,
    id: number,
    data: IProcessRequestData
  ): Promise<void> {
    try {
      let query = "";
      const fecha_respuesta = data.fecha_respuesta || new Date().toISOString();

      switch (tipoSolicitud) {
        case "usuarios":
          query = `
            UPDATE usuarios 
            SET 
              estado = $1,
              fecha_respuesta = $2,
              aprobado_por_ti_id = $3,
              observaciones_ti = $4
            WHERE id = $5
          `;
          break;
        case "accesos":
          query = `
            UPDATE solicitudes_accesos 
            SET 
              estado = $1,
              fecha_respuesta = $2,
              procesado_por_ti_id = $3,
              observaciones_ti = $4
            WHERE id = $5
          `;
          break;
        case "equipos":
          query = `
            UPDATE solicitudes_equipos 
            SET 
              estado = $1,
              fecha_respuesta = $2,
              procesado_por_ti_id = $3,
              observaciones_ti = $4
            WHERE id = $5
          `;
          break;
        default:
          throw {
            message: "Tipo de solicitud no válido",
            status: 400,
          };
      }

      const result = await this.client.query(query, [
        data.estado,
        fecha_respuesta,
        data.procesado_por_ti_id,
        data.observaciones_ti || null,
        id,
      ]);

      this.validateRowCount(result, {
        message: `Solicitud de ${tipoSolicitud} no encontrada`,
        status: 404,
      });
    } catch (error: any) {
      throw error;
    }
  }
}
