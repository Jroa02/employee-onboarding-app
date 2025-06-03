import { Router } from "express";
import { PermissionController } from "../../application/controllers/PermissionController";

export function setPermissionRoutes(app: Router) {
  app.post(
    "/permisos/solicitudes",
    PermissionController.createPermissionRequest
  );
  app.get(
    "/permisos/:categoria",
    PermissionController.getPermissionsByCategory
  );
  app.get(
    "/permisos/solicitudes/accesos/:id",
    PermissionController.getPermissionById
  );
}
