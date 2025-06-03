import {
  ILeaderRepository,
  IRequestUsersByLeader,
  IRequestAccessByLeader,
  IRequestEquipmentByLeader,
} from "../../domain/repositories/ILeaderRepository";
import { getPool } from "../database/connection";
import { toColombianTime } from "../../application/utils/dateUtils";

export class LeaderRepository implements ILeaderRepository {
  private client = getPool();

  private validateRowCount(result: any, message: object) {
    if (result.rowCount === 0) {
      throw message;
    }
  }
  async getRequestUsersByLeader(
    leaderId: number
  ): Promise<IRequestUsersByLeader[]> {
    try {
      const query = `SELECT * FROM public.vista_solicitudes_usuarios WHERE lider_id = $1`;

      const result = await this.client.query(query, [leaderId]);
      this.validateRowCount(result, {
        message: "No se encontraron solicitudes para este líder.",
        status: 404,
      });

      // Mapear resultados de usuarios
      return this.mapRowsToRequestUsersByLeader(result.rows);
    } catch (error: any) {
      throw error;
    }
  }
  private mapRowsToRequestUsersByLeader(rows: any[]): IRequestUsersByLeader[] {
    return rows.map((row) => {
      return {
        tipo_solicitud: "usuarios",
        id: row.solicitud_id,
        nombre: row.nombre_solicitado,
        email: row.email_solicitado,
        area: row.area_solicitada,
        rol: row.rol_solicitado,
        estado: row.estado,
        fecha_solicitud: toColombianTime(row.fecha_solicitud),
        fecha_respuesta: toColombianTime(row.fecha_respuesta),
        procesado_por: row.procesado_por || null,
        especialidad_ti: row.especialidad_ti || null,
        observaciones_ti: row.observaciones_ti || null,
      };
    });
  }
  async getRequestAccessByLeader(
    leaderId: number
  ): Promise<IRequestAccessByLeader[]> {
    try {
      const query = `SELECT * FROM public.vista_solicitudes_accesos WHERE lider_id = $1`;

      const result = await this.client.query(query, [leaderId]);
      this.validateRowCount(result, {
        message: "No se encontraron solicitudes de acceso para este líder.",
        status: 404,
      });

      // Mapear resultados de accesos
      return this.mapRowsToRequestAccessByLeader(result.rows);
    } catch (error: any) {
      throw error;
    }
  }
  private mapRowsToRequestAccessByLeader(
    rows: any[]
  ): IRequestAccessByLeader[] {
    return rows.map((row) => {
      return {
        tipo_solicitud: "accesos",
        solicitud_id: row.solicitud_id,
        usuario_id: row.usuario_id,
        usuario_nombre: row.usuario_nombre,
        usuario_email: row.usuario_email,
        usuario_area: row.usuario_area,
        usuario_rol: row.usuario_rol,
        permiso_id: row.permiso_id,
        nombre_permiso: row.nombre_permiso,
        permiso_descripcion: row.permiso_descripcion,
        permiso_categoria: row.permiso_categoria,
        estado: row.estado,
        fecha_solicitud: toColombianTime(row.fecha_solicitud),
        fecha_respuesta: toColombianTime(row.fecha_respuesta),
        procesado_por: row.procesado_por || null,
        especialidad_ti: row.especialidad_ti || null,
        observaciones_ti: row.observaciones_ti || null,
      };
    });
  }
  async getRequestEquipmentByLeader(
    leaderId: number
  ): Promise<IRequestEquipmentByLeader[]> {
    try {
      const query = `SELECT * FROM public.vista_solicitudes_equipos WHERE lider_id = $1`;

      const result = await this.client.query(query, [leaderId]);
      this.validateRowCount(result, {
        message: "No se encontraron solicitudes de equipos para este líder.",
        status: 404,
      });

      // Mapear resultados de equipos
      return this.mapRowsToRequestEquipmentByLeader(result.rows);
    } catch (error: any) {
      throw error;
    }
  }

  private mapRowsToRequestEquipmentByLeader(
    rows: any[]
  ): IRequestEquipmentByLeader[] {
    return rows.map((row) => {
      return {
        tipo_solicitud: "equipos",
        solicitud_id: row.solicitud_id,
        usuario_id: row.usuario_id,
        usuario_nombre: row.usuario_nombre,
        usuario_email: row.usuario_email,
        usuario_area: row.usuario_area,
        usuario_rol: row.usuario_rol,
        equipo_id: row.equipo_id,
        equipo_tipo: row.equipo_tipo,
        equipoc_marca: row.equipoc_marca,
        equipo_modelo: row.equipo_modelo,
        numero_serie: row.numero_serie,
        procesador: row.procesador || null,
        ram: row.ram || null,
        almacenamiento: row.almacenamiento || null,
        sistema_operativo: row.sistema_operativo || null,
        estado_equipo: row.estado_equipo,
        estado: row.estado,
        fecha_solicitud: toColombianTime(row.fecha_solicitud),
        fecha_respuesta: toColombianTime(row.fecha_respuesta),
        procesado_por: row.procesado_por || null,
        especialidad_ti: row.especialidad_ti || null,
        observaciones_ti: row.observaciones_ti || null,
      };
    });
  }
}
