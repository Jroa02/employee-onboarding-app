import { ISolicitudConflicto } from "../entities/SolicitudConflicto";

export interface ISolicitudRepository {
  getEquipmentConflicts(idEquipo: number): Promise<ISolicitudConflicto>;
}
