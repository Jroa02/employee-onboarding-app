export interface Equipo {
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
  fecha_adquisicion: string | null;
  observaciones: string | null;
  fecha_creacion: string;
}

export interface SolicitudEquipo {
  usuario_id: number;
  equipo_id: number;
  lider_solicitante_id: number;
}

export interface EquipoDetalle {
  id: number;
  tipo: "laptop" | "desktop";
  marca: string;
  modelo: string;
  numero_serie: string;
  procesador: string | null;
  ram: string | null;
  almacenamiento: string | null;
  sistema_operativo: string | null;
  estado: "disponible" | "asignado" | "mantenimiento";
  fecha_adquisicion: string | null;
  observaciones: string | null;
  fecha_creacion: string;
}

export interface EquipmentResponse {
  success: boolean;
  data: Equipo[];
}

export interface IEquipmentRepository {
  getEquipmentByStatus(estado: string): Promise<Equipo[]>;
  createEquipmentRequest(solicitud: SolicitudEquipo): Promise<void>;
  getEquipmentRequestDetail(id: number): Promise<EquipoDetalle>;
}
