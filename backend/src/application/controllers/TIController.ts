import { Request, Response } from "express";
import { TIService } from "../services/TIService";
import { ApiResponse, ApiError } from "../../domain/types/ApiResponse";
import {
  ITIUserRequest,
  ITIUser,
  IProcessRequestData,
} from "../../domain/repositories/ITIRepository";

const tiService = new TIService();

export const TIController = {
  getAllRequestsByType: async (req: Request, res: Response) => {
    try {
      const tipoSolicitud = req.params.tipo_solicitud;

      // Validar que el tipo de solicitud sea válido
      const validTypes = ["usuarios", "accesos", "equipos"];
      if (!validTypes.includes(tipoSolicitud)) {
        return res.status(400).json({
          success: false,
          message:
            "Tipo de solicitud inválido. Debe ser: usuarios, accesos o equipos",
        });
      }

      const requests = await tiService.getAllRequestsByType(tipoSolicitud);

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      // Validar que el ID sea un número válido
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido. Debe ser un número",
        });
      }

      const user = await tiService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario TI no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },

  processRequest: async (req: Request, res: Response) => {
    try {
      const tipoSolicitud = req.params.tipo_solicitud;
      const id = parseInt(req.params.id);
      const { estado, fecha_respuesta, procesado_por_ti_id, observaciones_ti } =
        req.body;

      // Validar que el tipo de solicitud sea válido
      const validTypes = ["usuarios", "accesos", "equipos"];
      if (!validTypes.includes(tipoSolicitud)) {
        return res.status(400).json({
          success: false,
          message:
            "Tipo de solicitud inválido. Debe ser: usuarios, accesos o equipos",
        });
      }

      // Validar que el ID sea un número válido
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido. Debe ser un número",
        });
      }

      // Validar que el estado sea válido
      if (!estado || !["aprobado", "rechazado"].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: "Estado inválido. Debe ser: aprobado o rechazado",
        });
      }

      // Validar que procesado_por_ti_id sea un número válido
      if (!procesado_por_ti_id || isNaN(procesado_por_ti_id)) {
        return res.status(400).json({
          success: false,
          message:
            "procesado_por_ti_id es requerido y debe ser un número válido",
        });
      }

      const requestData: IProcessRequestData = {
        estado,
        fecha_respuesta,
        procesado_por_ti_id,
        observaciones_ti,
      };

      await tiService.processRequest(tipoSolicitud, id, requestData);

      res.status(204).send();
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },
};
