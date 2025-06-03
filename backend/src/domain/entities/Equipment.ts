export class Equipment {
  id: number;
  tipo: "laptop" | "desktop";
  marca: string;
  modelo: string;
  numero_serie: string;
  procesador: string;
  ram: string;
  almacenamiento: string;
  sistema_operativo: string;
  estado: "disponible" | "asignado" | "mantenimiento";
  fecha_adquisicion: Date | null;
  observaciones: string | null;
  fecha_creacion: Date;

  constructor(
    id: number,
    tipo: "laptop" | "desktop",
    marca: string,
    modelo: string,
    numero_serie: string,
    procesador: string,
    ram: string,
    almacenamiento: string,
    sistema_operativo: string,
    estado: "disponible" | "asignado" | "mantenimiento",
    fecha_adquisicion: Date | null,
    observaciones: string | null,
    fecha_creacion: Date
  ) {
    this.id = id;
    this.tipo = tipo;
    this.marca = marca;
    this.modelo = modelo;
    this.numero_serie = numero_serie;
    this.procesador = procesador;
    this.ram = ram;
    this.almacenamiento = almacenamiento;
    this.sistema_operativo = sistema_operativo;
    this.estado = estado;
    this.fecha_adquisicion = fecha_adquisicion;
    this.observaciones = observaciones;
    this.fecha_creacion = fecha_creacion;
  }
}
