import { Router } from "express";
import { LeaderController } from "../../application/controllers/LeaderController";

const router = Router();

export function setLeaderRoutes(app: Router) {
  app.get(
    "/lideres/:id/usuarios/solicitudes",
    LeaderController.getRequestUsersByLeader
  );
  app.get(
    "/lideres/:id/accesos/solicitudes",
    LeaderController.getRequestAccessByLeader
  );
  app.get(
    "/lideres/:id/equipos/solicitudes",
    LeaderController.getRequestEquipmentByLeader
  );
}
