export interface ISolicitudConflicto {
  total_conflictos: number;
  solicitudes_conflictivas: ISolicitudConflictiva[];
}

export interface ISolicitudConflictiva {
  solicitud_id: number;
}
