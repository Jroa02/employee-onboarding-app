import { Request, Response } from "express";
import { PermissionService } from "../services/PermissionService";
import { SolicitudPermiso } from "../../domain/repositories/IPermissionRepository";

const permissionService = new PermissionService();

export const PermissionController = {
  getPermissionsByCategory: async (req: Request, res: Response) => {
    try {
      const { categoria } = req.params;

      const permisos = await permissionService.getPermissionsByCategory(
        categoria
      );

      // Respuesta según OAS
      res.status(200).json({
        success: true,
        data: permisos,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },

  createPermissionRequest: async (req: Request, res: Response) => {
    try {
      const solicitudData: SolicitudPermiso = {
        usuario_id: req.body.usuario_id,
        permiso_id: req.body.permiso_id,
        lider_solicitante_id: req.body.lider_solicitante_id,
      };

      await permissionService.createPermissionRequest(solicitudData);

      // Respuesta 204 según OAS
      res.status(204).send();
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },

  getPermissionById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      // Validar que el ID sea un número válido
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido. Debe ser un número",
        });
      }

      const permiso = await permissionService.getPermissionById(id);

      // Respuesta según OAS
      res.status(200).json({
        success: true,
        data: permiso,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },
};
