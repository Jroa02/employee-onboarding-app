// Interfaces para estadísticas y paginación
export interface Statistics {
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
}

export interface PaginatedData {
  data: unknown[];
  total: number;
  startIndex: number;
  endIndex: number;
}

// Interface para permisos de acceso
export interface Permission {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  activo: boolean;
  fecha_creacion: string;
}
