import {
  IPermissionRepository,
  Permiso,
  SolicitudPermiso,
} from "../../domain/repositories/IPermissionRepository";
import { getPool } from "../database/connection";
import { toColombianTime } from "../../application/utils/dateUtils";

export class PermissionRepository implements IPermissionRepository {
  private client = getPool();

  async getPermissionsByCategory(categoria: string): Promise<Permiso[]> {
    try {
      const query = `
        SELECT * FROM public.permisos_disponibles 
        WHERE categoria = $1
        ORDER BY id ASC
      `;

      const result = await this.client.query(query, [categoria]);
      return result.rows.map((row) => ({
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        categoria: row.categoria,
        activo: row.activo,
        fecha_creacion:
          toColombianTime(row.fecha_creacion) || row.fecha_creacion,
      }));
    } catch (error: any) {
      console.error("Error al obtener permisos por categoría:", error);
      throw {
        message: "Error al obtener permisos",
        status: 500,
      };
    }
  }

  async createPermissionRequest(solicitud: SolicitudPermiso): Promise<void> {
    try {
      const query = `
        INSERT INTO solicitudes_accesos (
          usuario_id,
          permiso_id, 
          lider_solicitante_id
        ) VALUES ($1, $2, $3)
      `;

      const values = [
        solicitud.usuario_id,
        solicitud.permiso_id,
        solicitud.lider_solicitante_id,
      ];

      await this.client.query(query, values);
    } catch (error: any) {
      console.error("Error al crear solicitud de permiso:", error);

      // Manejar errores específicos de BD
      if (error.code === "23503") {
        // foreign_key_violation
        throw {
          message: "Usuario, permiso o líder no válido",
          status: 400,
        };
      } else if (error.code === "23505") {
        // unique_violation
        throw {
          message: "Ya existe una solicitud para este usuario y permiso",
          status: 400,
        };
      }

      throw {
        message: "Error al crear solicitud de permiso",
        status: 500,
      };
    }
  }
  async getPermissionById(id: number): Promise<Permiso> {
    try {
      const query = `
        SELECT 
          p.id as permiso_id,
          p.nombre_permiso,
          p.descripcion,
          p.categoria,
          p.activo,
          p.fecha_creacion as permiso_fecha_creacion
        FROM solicitudes_accesos sa
        JOIN permisos_disponibles p ON sa.permiso_id = p.id
        WHERE sa.id = $1
      `;

      const result = await this.client.query(query, [id]);

      if (result.rows.length === 0) {
        throw {
          message: "Solicitud de acceso no encontrada",
          status: 404,
        };
      }

      const row = result.rows[0];
      return {
        id: row.permiso_id,
        nombre: row.nombre_permiso,
        descripcion: row.descripcion,
        categoria: row.categoria,
        activo: row.activo,
        fecha_creacion:
          toColombianTime(row.permiso_fecha_creacion) ||
          row.permiso_fecha_creacion,
      };
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error("Error al obtener permiso por ID:", error);
      throw {
        message: "Error al obtener permiso",
        status: 500,
      };
    }
  }
}
