import { Router } from "express";
import { UserController } from "../../application/controllers/UserController";

export function setUserRoutes(app: Router) {
  app.post("/usuarios", UserController.createUser);
  app.get(
    "/usuarios/:id_lider/:estado",
    UserController.getUsersByLeaderAndEstado
  );
}
