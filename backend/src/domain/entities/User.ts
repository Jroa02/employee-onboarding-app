export class User {
  id: number;
  nombre: string;
  email: string;
  area: string;
  rol: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  fecha_creacion: Date;
  fecha_respuesta?: Date;

  constructor(
    id: number,
    nombre: string,
    email: string,
    area: string,
    rol: string,
    estado: "pendiente" | "aprobado" | "rechazado",
    fecha_creacion: Date,
    fecha_respuesta?: Date
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.area = area;
    this.rol = rol;
    this.estado = estado;
    this.fecha_creacion = fecha_creacion;
    this.fecha_respuesta = fecha_respuesta;
  }
}
