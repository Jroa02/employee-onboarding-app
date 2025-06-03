import { Request, Response } from "express";
import { LeaderService } from "../services/LeaderService";
import { ApiResponse, ApiError } from "../../domain/types/ApiResponse";
import {
  IRequestUsersByLeader,
  IRequestAccessByLeader,
  IRequestEquipmentByLeader,
} from "../../domain/repositories/ILeaderRepository";

const leaderService = new LeaderService();

export const LeaderController = {
  getRequestUsersByLeader: async (req: Request, res: Response) => {
    try {
      const leaderId = parseInt(req.params.id);

      // Validar parámetros
      if (!leaderId || isNaN(leaderId)) {
        return res.status(400).json({
          success: false,
          message: "ID de líder inválido",
        });
      }

      const requests = await leaderService.getRequestUsersByLeader(leaderId);

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },

  getRequestAccessByLeader: async (req: Request, res: Response) => {
    try {
      const leaderId = parseInt(req.params.id);

      // Validar parámetros
      if (!leaderId || isNaN(leaderId)) {
        return res.status(400).json({
          success: false,
          message: "ID de líder inválido",
        });
      }

      const requests = await leaderService.getRequestAccessByLeader(leaderId);

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },

  getRequestEquipmentByLeader: async (req: Request, res: Response) => {
    try {
      const leaderId = parseInt(req.params.id);

      // Validar parámetros
      if (!leaderId || isNaN(leaderId)) {
        return res.status(400).json({
          success: false,
          message: "ID de líder inválido",
        });
      }

      const requests = await leaderService.getRequestEquipmentByLeader(
        leaderId
      );

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  },
};
