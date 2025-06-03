export interface SolicitudAcceso {
  id?: number; // Para compatibilidad con el frontend
  solicitud_id: number; // ID real de la API
  tipo_solicitud: string;
  usuario_id: number;
  usuario_nombre: string;
  usuario_email: string;
  usuario_area: string;
  usuario_rol: string;
  permiso_id: number;
  nombre_permiso: string;
  permiso_descripcion: string;
  permiso_categoria: string;
  estado: string;
  fecha_solicitud: string;
  fecha_respuesta?: string | null;
  procesado_por?: string | null;
  especialidad_ti?: string | null;
  observaciones_ti?: string | null;
  // Campos opcionales para compatibilidad
  lider_solicitante_id?: number;
  lider_solicitante_nombre?: string;
  fecha_aprobacion?: string;
  fecha_rechazo?: string;
  motivo_rechazo?: string;
}
