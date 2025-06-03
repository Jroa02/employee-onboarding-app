export interface IRequestUsersByLeader {
  tipo_solicitud: "usuarios";
  id: number;
  nombre: string;
  email: string;
  area: string;
  rol: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  fecha_solicitud: string | null;
  fecha_respuesta: string | null;
  procesado_por: string | null;
  especialidad_ti: string | null;
  observaciones_ti: string | null;
}

export interface IRequestAccessByLeader {
  tipo_solicitud: "accesos";
  solicitud_id: number;
  usuario_id: number;
  usuario_nombre: string;
  usuario_email: string;
  usuario_area: string;
  usuario_rol: string;
  permiso_id: number;
  nombre_permiso: string;
  permiso_descripcion: string;
  permiso_categoria: "Desarrollo" | "Infrastructura" | "Pruebas" | "Agile";
  estado: "pendiente" | "aprobado" | "rechazado";
  fecha_solicitud: string | null;
  fecha_respuesta: string | null;
  procesado_por: string | null;
  especialidad_ti: string | null;
  observaciones_ti: string | null;
}

export interface IRequestEquipmentByLeader {
  tipo_solicitud: "equipos";
  solicitud_id: number;
  usuario_id: number;
  usuario_nombre: string;
  usuario_email: string;
  usuario_area: string;
  usuario_rol: string;
  equipo_id: number;
  equipo_tipo: "laptop" | "desktop";
  equipoc_marca: string;
  equipo_modelo: string;
  numero_serie: string;
  procesador: string | null;
  ram: string | null;
  almacenamiento: string | null;
  sistema_operativo: string | null;
  estado_equipo: "disponible" | "asignado" | "mantenimiento";
  estado: "pendiente" | "aprobado" | "rechazado";
  fecha_solicitud: string | null;
  fecha_respuesta: string | null;
  procesado_por: string | null;
  especialidad_ti: string | null;
  observaciones_ti: string | null;
}

export interface ILeaderRepository {
  getRequestUsersByLeader(leaderId: number): Promise<IRequestUsersByLeader[]>;
  getRequestAccessByLeader(leaderId: number): Promise<IRequestAccessByLeader[]>;
  getRequestEquipmentByLeader(
    leaderId: number
  ): Promise<IRequestEquipmentByLeader[]>;
}
