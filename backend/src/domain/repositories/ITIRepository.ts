export interface ITIUserRequest {
  lider_id: number;
  lider_nombre: string;
  lider_area: string;
  tipo_solicitud: "usuarios" | "accesos" | "equipos";
  solicitud_id: number;
  beneficiario_id: number;
  beneficiario_nombre: string;
  beneficiario_email: string;
  beneficiario_area: string;
  beneficiario_rol: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  fecha_solicitud: string;
  fecha_respuesta: string | null;
  procesado_por_ti_id: number | null;
  procesado_por_ti: string | null;
  especialidad_ti: string | null;
  observaciones_ti: string | null;
}

export interface ITIUser {
  id: number;
  nombre: string;
  email: string;
  especialidad: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface IProcessRequestData {
  estado: "aprobado" | "rechazado";
  fecha_respuesta?: string;
  procesado_por_ti_id: number;
  observaciones_ti?: string;
}

export interface ITIRepository {
  getAllRequestsByType(tipoSolicitud: string): Promise<ITIUserRequest[]>;
  getUserById(id: number): Promise<ITIUser>;
  processRequest(
    tipoSolicitud: string,
    id: number,
    data: IProcessRequestData
  ): Promise<void>;
}
