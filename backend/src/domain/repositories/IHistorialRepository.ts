import { IHistorialAsignacion } from "../entities/HistorialAsignacion";

export interface IHistorialRepository {
  getEquipmentAssignmentHistory(
    equipoId: number
  ): Promise<IHistorialAsignacion[]>;
}
