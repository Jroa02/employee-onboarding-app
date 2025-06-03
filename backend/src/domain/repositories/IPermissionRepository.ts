export interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: "Desarrollo" | "Infrastructura" | "Pruebas" | "Agile";
  activo: boolean;
  fecha_creacion: string;
}

export interface SolicitudPermiso {
  usuario_id: number;
  permiso_id: number;
  lider_solicitante_id: number;
}

export interface PermisosResponse {
  success: boolean;
  data: Permiso[];
}

export interface IPermissionRepository {
  getPermissionsByCategory(categoria: string): Promise<Permiso[]>;
  createPermissionRequest(solicitud: SolicitudPermiso): Promise<void>;
  getPermissionById(id: number): Promise<Permiso>;
}
