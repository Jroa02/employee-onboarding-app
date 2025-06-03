import { Router } from "express";
import { SolicitudController } from "../../application/controllers/SolicitudController";

const solicitudController = new SolicitudController();

// Function to set solicitud routes
export const setSolicitudRoutes = (router: Router) => {
  // GET /solicitudes/equipos/{idEquipo} - Obtener conflictos de equipos por ID
  router.get("/solicitudes/equipos/:idEquipo", (req, res) => {
    solicitudController.getEquipmentConflicts(req, res);
  });
};
