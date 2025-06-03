export interface SolicitudUsuario {
  tipo_solicitud: string;
  id: number;
  nombre: string;
  email: string;
  area: string;
  rol: string;
  estado: string;
  fecha_solicitud: string;
  fecha_respuesta: string;
  procesado_por: string;
  especialidad_ti: string;
  observaciones_ti: string;
}

export interface ApiResponse {
  success: boolean;
  data: SolicitudUsuario[];
}
