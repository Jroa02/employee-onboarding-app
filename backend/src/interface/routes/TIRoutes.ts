import { Router } from "express";
import { TIController } from "../../application/controllers/TIController";

export function setTIRoutes(app: Router) {
  app.get("/ti/:tipo_solicitud/solicitudes", TIController.getAllRequestsByType);
  app.get("/ti/user/:id", TIController.getUserById);
  app.patch("/ti/solicitudes/:tipo_solicitud/:id", TIController.processRequest);
}
