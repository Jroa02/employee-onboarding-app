import { Request, Response } from "express";
import { EquipmentService } from "../services/EquipmentService";

export class EquipmentController {
  private equipmentService: EquipmentService;

  constructor() {
    this.equipmentService = new EquipmentService();
  }

  async getEquipmentByStatus(req: Request, res: Response) {
    try {
      const { estado } = req.params;

      const equipos = await this.equipmentService.getEquipmentByStatus(estado);

      return res.status(200).json({
        success: true,
        data: equipos,
      });
    } catch (error: any) {
      console.error(
        "Error en EquipmentController.getEquipmentByStatus:",
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

  async createEquipmentRequest(req: Request, res: Response) {
    try {
      const { usuario_id, equipo_id, lider_solicitante_id } = req.body;

      await this.equipmentService.createEquipmentRequest({
        usuario_id,
        equipo_id,
        lider_solicitante_id,
      });

      return res.status(204).send();
    } catch (error: any) {
      console.error(
        "Error en EquipmentController.createEquipmentRequest:",
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

  async getEquipmentRequestDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const equipmentId = parseInt(id, 10);

      const equipoDetalle =
        await this.equipmentService.getEquipmentRequestDetail(equipmentId);

      return res.status(200).json({
        success: true,
        data: equipoDetalle,
      });
    } catch (error: any) {
      console.error(
        "Error en EquipmentController.getEquipmentRequestDetail:",
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
