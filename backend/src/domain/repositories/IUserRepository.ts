export interface CreateUserRequest {
  nombre: string;
  email: string;
  area: string;
  rol: string;
  lider_solicitante_id: number;
}

export interface UserByEstado {
  id: number;
  nombre: string;
  email: string;
  area: string;
  rol: string;
  estado: string; // Flexible para manejar diferentes estados según el contexto
  fecha_creacion: string;
  fecha_respuesta: string | null;
  lider_solicitante_id: number;
  aprobado_por_ti_id: string | null;
  observaciones_ti: string | null;
}

export interface IUserRepository {
  createUser(userData: CreateUserRequest): Promise<void>;
  getUsersByLeaderAndEstado(
    idLider: number,
    estado: string
  ): Promise<UserByEstado[]>;
}
