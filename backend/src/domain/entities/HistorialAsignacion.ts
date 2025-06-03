export interface IHistorialAsignacion {
  id: number;
  equipo_id: number;
  usuario_id: number;
  usuario_nombre: string;
  usuario_email: string;
  accion: "asignado" | "devuelto" | "mantenimiento" | "baja";
  fecha_accion: string | null;
  fecha_devolucion: string | null;
  observaciones: string | null;
  ejecutado_por_ti_id: number | null;
}
