import { useState, useEffect } from "react";
import {
  FaTimes,
  FaHistory,
  FaUser,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import type { HistorialAsignacion } from "../interfaces";

interface HistorialAsignacionModalProps {
  isOpen: boolean;
  equipoId: number | null;
  onClose: () => void;
}

const HistorialAsignacionModal = ({
  isOpen,
  equipoId,
  onClose,
}: HistorialAsignacionModalProps) => {
  const [historial, setHistorial] = useState<HistorialAsignacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchHistorial = async () => {
    if (!equipoId) return;

    try {
      setLoading(true);
      setError(null);
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(
        `${API_BASE_URL}/historial/asignaciones/equipos/${equipoId}`
      );

      if (response.status === 404) {
        // Si es 404, no es un error sino que no hay historial
        setHistorial([]);
        setError(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setHistorial(data.data || []);
      } else {
        throw new Error("Error al obtener el historial");
      }
    } catch (err) {
      console.error("Error al cargar historial:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen && equipoId) {
      fetchHistorial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, equipoId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getAccionColor = (accion: string) => {
    switch (accion.toLowerCase()) {
      case "asignado":
        return "bg-green-100 text-green-800";
      case "devuelto":
        return "bg-blue-100 text-blue-800";
      case "reasignado":
        return "bg-yellow-100 text-yellow-800";
      case "retirado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccionIcon = (accion: string) => {
    switch (accion.toLowerCase()) {
      case "asignado":
        return <FaUser className="text-green-600 text-sm" />;
      case "devuelto":
        return <FaHistory className="text-blue-600 text-sm" />;
      case "reasignado":
        return <FaHistory className="text-yellow-600 text-sm" />;
      case "retirado":
        return <FaTimes className="text-red-600 text-sm" />;
      default:
        return <FaInfoCircle className="text-gray-600 text-sm" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaHistory className="text-blue-600 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">
              Historial de Asignaciones - Equipo #{equipoId}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-600">Cargando historial...</div>
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-600">Error: {error}</div>
            </div>
          )}{" "}
          {!loading && !error && historial.length === 0 && (
            <div className="flex flex-col justify-center items-center py-12">
              <FaInfoCircle className="text-gray-400 text-4xl mb-4" />
              <div className="text-gray-500 text-lg font-medium">
                No se encontraron asignaciones
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Este equipo aún no tiene historial de asignaciones registrado
              </div>
            </div>
          )}
          {!loading && !error && historial.length > 0 && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Total de registros: {historial.length}
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {historial.map((registro, index) => (
                  <div
                    key={registro.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border"
                  >
                    {/* Icon and line */}
                    <div className="flex flex-col items-center">
                      <div className="bg-white rounded-full p-2 border-2 border-gray-200">
                        {getAccionIcon(registro.accion)}
                      </div>
                      {index < historial.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getAccionColor(
                              registro.accion
                            )}`}
                          >
                            {registro.accion}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {registro.usuario_nombre}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({registro.usuario_email})
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(registro.fecha_accion)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Usuario ID:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {registro.usuario_id}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Equipo ID:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {registro.equipo_id}
                          </span>
                        </div>
                        {registro.fecha_devolucion && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Fecha Devolución:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {formatDate(registro.fecha_devolucion)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">
                            Ejecutado por TI ID:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {registro.ejecutado_por_ti_id}
                          </span>
                        </div>
                      </div>

                      {registro.observaciones && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <span className="font-medium text-gray-700">
                            Observaciones:
                          </span>
                          <p className="mt-1 text-gray-600">
                            {registro.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialAsignacionModal;
