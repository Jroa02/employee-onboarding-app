import { Router } from "express";
import { HistorialController } from "../../application/controllers/HistorialController";

const historialController = new HistorialController();

// Function to set historial routes
export const setHistorialRoutes = (router: Router) => {
  // GET /historial/asignaciones/equipos/{id} - Obtener historial de asignaciones de equipos por ID
  router.get("/historial/asignaciones/equipos/:id", (req, res) => {
    historialController.getEquipmentAssignmentHistory(req, res);
  });
};
