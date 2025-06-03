import { EquipmentRepository } from "../../infrastructure/repositories/EquipmentRepository";
import {
  Equipo,
  SolicitudEquipo,
  EquipoDetalle,
} from "../../domain/repositories/IEquipmentRepository";

export class EquipmentService {
  private equipmentRepository: EquipmentRepository;

  constructor() {
    this.equipmentRepository = new EquipmentRepository();
  }

  async getEquipmentByStatus(estado: string): Promise<Equipo[]> {
    return await this.equipmentRepository.getEquipmentByStatus(estado);
  }

  async createEquipmentRequest(solicitud: SolicitudEquipo): Promise<void> {
    return await this.equipmentRepository.createEquipmentRequest(solicitud);
  }

  async getEquipmentRequestDetail(id: number): Promise<EquipoDetalle> {
    return await this.equipmentRepository.getEquipmentRequestDetail(id);
  }
}
