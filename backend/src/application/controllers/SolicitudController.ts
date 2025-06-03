import { Request, Response } from "express";
import { SolicitudService } from "../services/SolicitudService";

export class SolicitudController {
  private solicitudService: SolicitudService;

  constructor() {
    this.solicitudService = new SolicitudService();
  }

  async getEquipmentConflicts(req: Request, res: Response) {
    try {
      const { idEquipo } = req.params;
      const equipoId = parseInt(idEquipo, 10);

      if (isNaN(equipoId) || equipoId <= 0) {
        return res.status(400).json({
          error: {
            message: "El ID del equipo debe ser un número positivo válido",
            status: 400,
          },
        });
      }

      const conflictos = await this.solicitudService.getEquipmentConflicts(
        equipoId
      );

      return res.status(200).json({
        success: true,
        data: [conflictos], // Wrapped in array to match OAS specification
      });
    } catch (error: any) {
      console.error(
        "Error en SolicitudController.getEquipmentConflicts:",
        error
      );

      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";

      return res.status(status).json({
        error: {
          message,
          status,
        },
      });
    }
  }
}
