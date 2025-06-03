import { useState, useEffect } from "react";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

interface SolicitudConflictiva {
  solicitud_id: number;
  usuario_nombre: string;
  usuario_email: string;
  fecha_solicitud: string;
}

interface ConflictData {
  success: boolean;
  equipo_id: number;
  total_conflictos: number;
  solicitudes_conflictivas: SolicitudConflictiva[];
  mensaje: string;
}

interface EquipmentConflictsProps {
  solicitudId: number;
  sectionTitle: string;
}

const EquipmentConflicts = ({
  solicitudId,
  sectionTitle,
}: EquipmentConflictsProps) => {
  const [conflicts, setConflicts] = useState<ConflictData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Solo hacer fetch para solicitudes de computadoras
    if (sectionTitle !== "Solicitudes de Computadores") {
      return;
    }

    const fetchConflicts = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:3001";

        const response = await fetch(
          `${API_BASE_URL}/solicitudes/equipos/${solicitudId}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Verificar que la respuesta tenga la estructura esperada
        if (result.success && result.data && result.data.length > 0) {
          setConflicts(result.data[0]);
        } else {
          setConflicts(null);
        }
      } catch (err) {
        console.error("Error fetching equipment conflicts:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchConflicts();
  }, [solicitudId, sectionTitle]);

  // Solo mostrar para solicitudes de computadoras
  if (sectionTitle !== "Solicitudes de Computadores") {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center">
          <FaSpinner className="animate-spin text-gray-600 mr-2" />
          <span className="text-sm text-gray-600">
            Verificando conflictos de equipo...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm">
          Error al verificar conflictos: {error}
        </p>
      </div>
    );
  }

  // Solo mostrar si hay conflictos
  if (!conflicts || conflicts.total_conflictos === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start">
        <FaExclamationTriangle className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-800 mb-2">
            ⚠️ Conflictos de Equipo Detectados
          </h4>
          <p className="text-sm text-amber-700 mb-3">{conflicts.mensaje}</p>

          {conflicts.solicitudes_conflictivas.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-800">
                Otras solicitudes para este equipo:
              </p>
              {conflicts.solicitudes_conflictivas.map((solicitud) => (
                <div
                  key={solicitud.solicitud_id}
                  className="bg-white p-3 rounded border border-amber-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {solicitud.usuario_nombre}
                      </p>
                      <p className="text-xs text-gray-600">
                        {solicitud.usuario_email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Solicitud ID: #{solicitud.solicitud_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Solicitado el:</p>
                      <p className="text-xs font-medium text-gray-700">
                        {formatDate(solicitud.fecha_solicitud)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 p-2 bg-amber-100 rounded">
            <p className="text-xs text-amber-800">
              <strong>Nota:</strong> Al aprobar esta solicitud, las otras
              solicitudes para el mismo equipo serán automáticamente rechazadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentConflicts;
