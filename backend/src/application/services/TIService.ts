import { TIRepository } from "../../infrastructure/repositories/TIRepository";
import {
  ITIUserRequest,
  ITIUser,
  IProcessRequestData,
} from "../../domain/repositories/ITIRepository";

export class TIService {
  private tiRepository: TIRepository;

  constructor() {
    this.tiRepository = new TIRepository();
  }

  async getAllRequestsByType(tipoSolicitud: string): Promise<ITIUserRequest[]> {
    return await this.tiRepository.getAllRequestsByType(tipoSolicitud);
  }

  async getUserById(id: number): Promise<ITIUser | null> {
    return await this.tiRepository.getUserById(id);
  }

  async processRequest(
    tipoSolicitud: string,
    id: number,
    data: IProcessRequestData
  ): Promise<void> {
    return await this.tiRepository.processRequest(tipoSolicitud, id, data);
  }
}
