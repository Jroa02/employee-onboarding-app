import {
  IEquipmentRepository,
  Equipo,
  SolicitudEquipo,
  EquipoDetalle,
} from "../../domain/repositories/IEquipmentRepository";
import { getPool } from "../database/connection";
import { toColombianTime } from "../../application/utils/dateUtils";

export class EquipmentRepository implements IEquipmentRepository {
  private client = getPool();

  async getEquipmentByStatus(estado: string): Promise<Equipo[]> {
    try {
      const query = `
        SELECT * FROM public.equipos 
        WHERE estado = $1 
        ORDER BY id ASC
      `;

      const result = await this.client.query(query, [estado]);

      // Validar si se encontraron resultados
      if (result.rowCount === 0) {
        throw {
          message: `No se encontraron equipos con estado: ${estado}`,
          status: 404,
        };
      }

      return result.rows.map((row) => ({
        id: row.id,
        tipo: row.tipo,
        marca: row.marca,
        modelo: row.modelo,
        numero_serie: row.numero_serie,
        procesador: row.procesador,
        ram: row.ram,
        almacenamiento: row.almacenamiento,
        sistema_operativo: row.sistema_operativo,
        estado: row.estado,
        fecha_adquisicion:
          toColombianTime(row.fecha_adquisicion) || row.fecha_adquisicion,
        observaciones: row.observaciones,
        fecha_creacion:
          toColombianTime(row.fecha_creacion) || row.fecha_creacion,
      }));
    } catch (error: any) {
      if (error.status) {
        throw error; // Re-throw custom errors
      }
      console.error("Error al obtener equipos por estado:", error);
      throw {
        message: "Error al obtener equipos",
        status: 500,
      };
    }
  }

  async createEquipmentRequest(solicitud: SolicitudEquipo): Promise<void> {
    try {
      const query = `
        INSERT INTO solicitudes_equipos (
          usuario_id,
          equipo_id, 
          lider_solicitante_id
        ) VALUES ($1, $2, $3)
      `;

      const values = [
        solicitud.usuario_id,
        solicitud.equipo_id,
        solicitud.lider_solicitante_id,
      ];

      await this.client.query(query, values);
    } catch (error: any) {
      console.error("Error al crear solicitud de equipo:", error);

      // Manejar errores específicos de BD
      if (error.code === "23503") {
        // foreign_key_violation
        throw {
          message: "Usuario, equipo o líder no válido",
          status: 400,
        };
      } else if (error.code === "23505") {
        // unique_violation
        throw {
          message: "Ya existe una solicitud de equipo para este usuario",
          status: 400,
        };
      }
      throw {
        message: "Error al crear la solicitud de equipo",
        status: 500,
      };
    }
  }

  async getEquipmentRequestDetail(id: number): Promise<EquipoDetalle> {
    try {
      const query = `
        SELECT 
          e.id,
          e.tipo,
          e.marca,
          e.modelo,
          e.numero_serie,
          e.procesador,
          e.ram,
          e.almacenamiento,
          e.sistema_operativo,
          e.estado,
          e.fecha_adquisicion,
          e.observaciones,
          e.fecha_creacion
        FROM solicitudes_equipos se
        JOIN equipos e ON se.equipo_id = e.id
        WHERE se.id = $1
      `;

      const result = await this.client.query(query, [id]);

      // Validar si se encontraron resultados
      if (result.rowCount === 0) {
        throw {
          message: `Solicitud de equipo no encontrada con ID: ${id}`,
          status: 404,
        };
      }

      const row = result.rows[0];
      return {
        id: row.id,
        tipo: row.tipo,
        marca: row.marca,
        modelo: row.modelo,
        numero_serie: row.numero_serie,
        procesador: row.procesador,
        ram: row.ram,
        almacenamiento: row.almacenamiento,
        sistema_operativo: row.sistema_operativo,
        estado: row.estado,
        fecha_adquisicion:
          toColombianTime(row.fecha_adquisicion) || row.fecha_adquisicion,
        observaciones: row.observaciones,
        fecha_creacion:
          toColombianTime(row.fecha_creacion) || row.fecha_creacion,
      };
    } catch (error: any) {
      if (error.status) {
        throw error; // Re-throw custom errors
      }
      console.error("Error al obtener detalle de solicitud de equipo:", error);
      throw {
        message: "Error al obtener detalle de solicitud de equipo",
        status: 500,
      };
    }
  }
}
