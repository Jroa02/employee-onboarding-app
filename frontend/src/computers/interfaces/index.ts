export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  area: string;
  rol: string;
  estado: string;
  fecha_creacion: string;
  fecha_respuesta: string;
  lider_solicitante_id: number;
  aprobado_por_ti_id: number;
  observaciones_ti: string;
}

export interface Equipo {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  procesador: string;
  ram: string;
  almacenamiento: string;
  sistema_operativo: string;
  estado: string;
  fecha_adquisicion: string;
  Observaciones: string;
  fecha_creacion: string;
}

export interface ComputadorForm {
  usuario_id: number | null;
  equipo_id: number | null;
  lider_solicitante_id: number;
}

export interface SolicitudEquipo {
  tipo_solicitud: string;
  solicitud_id: number;
  usuario_id: number;
  usuario_nombre: string;
  usuario_email: string;
  usuario_area: string;
  usuario_rol: string;
  equipo_id: number;
  equipo_tipo: string;
  equipoc_marca: string;
  equipo_modelo: string;
  numero_serie: string;
  procesador: string;
  ram: string;
  almacenamiento: string;
  sistema_operativo: string;
  estado_equipo: string;
  estado: string;
  fecha_solicitud: string;
  fecha_respuesta: string;
  procesado_por: string;
  especialidad_ti: string;
  observaciones_ti: string;
}

export interface HistorialAsignacion {
  id: number;
  equipo_id: number;
  usuario_id: number;
  usuario_nombre: string;
  usuario_email: string;
  accion: string;
  fecha_accion: string;
  fecha_devolucion: string;
  observaciones: string;
  ejecutado_por_ti_id: number;
}
