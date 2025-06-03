import { Request, Response } from "express";
import { HistorialService } from "../services/HistorialService";

export class HistorialController {
  private historialService: HistorialService;

  constructor() {
    this.historialService = new HistorialService();
  }

  async getEquipmentAssignmentHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const equipoId = parseInt(id, 10);

      if (isNaN(equipoId) || equipoId <= 0) {
        return res.status(400).json({
          error: {
            message: "El ID del equipo debe ser un número positivo válido",
            status: 400,
          },
        });
      }

      const historial =
        await this.historialService.getEquipmentAssignmentHistory(equipoId);

      return res.status(200).json({
        success: true,
        data: historial,
      });
    } catch (error: any) {
      console.error(
        "Error en HistorialController.getEquipmentAssignmentHistory:",
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
