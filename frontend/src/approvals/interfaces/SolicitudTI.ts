// Interfaces para las solicitudes de TI
export interface SolicitudTI {
  id: number;
  lider_nombre: string;
  lider_area: string;
  solicitud_id: number;
  beneficiario_nombre: string;
  beneficiario_area: string;
  estado: string;
  fecha_solicitud: string;
  tipo_solicitud?: string;
  email?: string;
  usuario_nombre?: string;
  // Campos adicionales para el modal de detalles
  [key: string]: unknown;
}

export interface SectionData {
  usuarios: SolicitudTI[];
  accesos: SolicitudTI[];
  equipos: SolicitudTI[];
}

export type SectionType = "usuarios" | "accesos" | "equipos";

// Interface para los detalles de equipo
export interface EquipmentDetails {
  equipo_id: number;
  tipo_equipo: string;
  marca: string;
  modelo: string;
  numero_serie?: string;
  especificaciones?: string;
  estado_equipo: string;
  fecha_asignacion?: string;
  observaciones?: string;
  ubicacion?: string;
  valor_estimado?: number;
  garantia_hasta?: string;
  proveedor?: string;
}
