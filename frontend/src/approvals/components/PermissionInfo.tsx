import { useState, useEffect, useRef } from "react";
import type { Permission } from "../interfaces";
import { API_BASE_URL } from "../../services/apiService";

interface PermissionInfoProps {
  solicitudId: number;
  sectionTitle: string;
}

const PermissionInfo = ({ solicitudId, sectionTitle }: PermissionInfoProps) => {
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedId = useRef<number | null>(null);

  // Solo mostrar información de permisos para solicitudes de acceso
  const isAccessRequest = sectionTitle.toLowerCase().includes("accesos");
  useEffect(() => {
    // Reset state cuando cambia solicitudId o sectionTitle
    if (lastFetchedId.current !== solicitudId) {
      setPermission(null);
      setError(null);
      setLoading(false);
    }

    // No hacer fetch si no es solicitud de acceso, no hay ID, o ya se cargó este ID
    if (
      !isAccessRequest ||
      !solicitudId ||
      lastFetchedId.current === solicitudId
    ) {
      return;
    }

    const fetchPermission = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/permisos/solicitudes/accesos/${solicitudId}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setPermission(data.data || data);
        lastFetchedId.current = solicitudId; // Marcar como cargado
      } catch (err) {
        console.error("Error al obtener información del permiso:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPermission();
  }, [solicitudId, isAccessRequest]);

  // No renderizar nada si no es una solicitud de acceso
  if (!isAccessRequest) {
    return null;
  }
  if (loading) {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-700 text-sm">
          Cargando información del permiso...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-700 text-sm">
          Error al cargar el permiso: {error}
        </p>
      </div>
    );
  }

  if (!permission) {
    return null;
  }
  return (
    <div className="pt-4 border-t border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        Información del Acceso Solicitado
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Nombre del Acceso
          </label>
          <p className="text-gray-900">{permission.nombre}</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Descripción del Acceso
          </label>
          <p className="text-gray-900">{permission.descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default PermissionInfo;
