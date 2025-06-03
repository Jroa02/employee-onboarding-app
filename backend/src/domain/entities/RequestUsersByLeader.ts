export class RequestUsersByLeader {
  tipo_solicitud: "usuarios";
  id: number;
  nombre: string;
  email: string;
  area: string;
  rol: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  fecha_solicitud: Date;
  fecha_respuesta?: Date;
  procesado_por?: string;
  especialidad_ti?: string;
  observaciones_ti?: string;

  constructor(
    id: number,
    nombre: string,
    email: string,
    area: string,
    rol: string,
    estado: "pendiente" | "aprobado" | "rechazado",
    fecha_solicitud: Date,
    fecha_respuesta?: Date,
    procesado_por?: string,
    especialidad_ti?: string,
    observaciones_ti?: string  ) {
    this.tipo_solicitud = "usuarios";
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.area = area;
    this.rol = rol;
    this.estado = estado;
    this.fecha_solicitud = fecha_solicitud;
    this.fecha_respuesta = fecha_respuesta;
    this.procesado_por = procesado_por;
    this.especialidad_ti = especialidad_ti;
    this.observaciones_ti = observaciones_ti;
  }
}
