import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../../domain/repositories/IUserRepository";

const userService = new UserService();

export const UserController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const userData: CreateUserRequest = {
        nombre: req.body.nombre,
        email: req.body.email,
        area: req.body.area,
        rol: req.body.rol,
        lider_solicitante_id: req.body.lider_solicitante_id,
      };

      await userService.createUser(userData);

      // Respuesta 204 según OAS
      res.status(204).send();
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },

  getUsersByLeaderAndEstado: async (req: Request, res: Response) => {
    try {
      const { id_lider, estado } = req.params;
      const idLider = parseInt(id_lider, 10);

      const usuarios = await userService.getUsersByLeaderAndEstado(
        idLider,
        estado
      );

      // Respuesta según OAS
      res.status(200).json({
        success: true,
        data: usuarios,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },
};
