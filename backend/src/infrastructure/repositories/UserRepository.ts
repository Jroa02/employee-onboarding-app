import {
  IUserRepository,
  CreateUserRequest,
  UserByEstado,
} from "../../domain/repositories/IUserRepository";
import { getPool } from "../database/connection";
import { toColombianTime } from "../../application/utils/dateUtils";

export class UserRepository implements IUserRepository {
  private client = getPool();

  async createUser(userData: CreateUserRequest): Promise<void> {
    try {
      const query = `
        INSERT INTO usuarios (nombre, email, area, rol, lider_solicitante_id)
        VALUES ($1, $2, $3, $4, $5)
      `;

      const values = [
        userData.nombre,
        userData.email,
        userData.area,
        userData.rol,
        userData.lider_solicitante_id,
      ];

      await this.client.query(query, values);
    } catch (error: any) {
      // Manejar errores específicos de BD
      if (error.code === "23505") {
        // unique_violation
        throw {
          message: "El email ya está registrado",
          status: 400,
        };
      } else if (error.code === "23503") {
        // foreign_key_violation
        throw {
          message: "El líder especificado no existe",
          status: 400,
        };
      }
      throw {
        message: "Error al crear el usuario",
        status: 500,
      };
    }
  }

  async getUsersByLeaderAndEstado(
    idLider: number,
    estado: string
  ): Promise<UserByEstado[]> {
    try {
      const query = `
        SELECT * FROM public.usuarios 
        WHERE lider_solicitante_id = $1 AND estado = $2 
        ORDER BY id ASC
      `;

      const result = await this.client.query(query, [idLider, estado]);

      return result.rows.map((row) => ({
        id: row.id,
        nombre: row.nombre,
        email: row.email,
        area: row.area,
        rol: row.rol,
        estado: row.estado,
        fecha_creacion:
          toColombianTime(row.fecha_creacion) || row.fecha_creacion,
        fecha_respuesta:
          toColombianTime(row.fecha_respuesta) || row.fecha_respuesta,
        lider_solicitante_id: row.lider_solicitante_id,
        aprobado_por_ti_id: row.aprobado_por_ti_id,
        observaciones_ti: row.observaciones_ti,
      }));
    } catch (error: any) {
      console.error("Error al obtener usuarios por líder y estado:", error);
      throw {
        message: "Error al obtener usuarios",
        status: 500,
      };
    }
  }
}
