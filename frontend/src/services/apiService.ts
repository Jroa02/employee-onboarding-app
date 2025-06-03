export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface CreateUserRequest {
  nombre: string;
  email: string;
  area: string;
  rol: string;
  lider_solicitante_id: number;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  area?: string;
  rol: string;
  estado: "Activo" | "Inactivo";
  fechaCreacion: string;
}

class ApiService {
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/usuarios`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateUser(
    id: number,
    userData: Partial<CreateUserRequest>
  ): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  }
}

export const apiService = new ApiService();
