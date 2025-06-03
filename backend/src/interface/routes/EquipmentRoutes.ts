import { Router } from "express";
import { EquipmentController } from "../../application/controllers/EquipmentController";

const equipmentController = new EquipmentController();

// Function to set equipment routes
export const setEquipmentRoutes = (router: Router) => {
  // GET /equipos/{estado} - Obtener equipos por estado
  router.get("/equipos/:estado", (req, res) => {
    equipmentController.getEquipmentByStatus(req, res);
  });

  // POST /equipos/solicitudes - Crear solicitud de equipo
  router.post("/equipos/solicitudes", (req, res) => {
    equipmentController.createEquipmentRequest(req, res);
  });

  // GET /equipos/solicitudes/{id}/detalle - Obtener detalles de una solicitud de equipo por ID
  router.get("/equipos/solicitudes/:id/detalle", (req, res) => {
    equipmentController.getEquipmentRequestDetail(req, res);
  });
};
