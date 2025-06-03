import type { SolicitudEquipo } from "../interfaces";

interface EquipoDetailModalProps {
  isOpen: boolean;
  solicitud: SolicitudEquipo | null;
  onClose: () => void;
}

const EquipoDetailModal = ({
  isOpen,
  solicitud,
  onClose,
}: EquipoDetailModalProps) => {
  if (!isOpen || !solicitud) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("es-ES");
    } catch {
      return dateString;
    }
  };

  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    return String(value);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "aprobada":
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "rechazada":
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Detalles de Solicitud de Equipo
          </h2>
        </div>{" "}
        <div className="p-6 space-y-6">
          {/* Información del Usuario */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Información del Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  ID Solicitud
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.solicitud_id)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nombre del Usuario
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.usuario_nombre)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Email del Usuario
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.usuario_email)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Área
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.usuario_area)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Rol
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.usuario_rol)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  ID Usuario
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.usuario_id)}
                </p>
              </div>
            </div>
          </div>
          {/* Información del Equipo */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Información del Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  ID Equipo
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.equipo_id)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tipo de Equipo
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.equipo_tipo)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Marca
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.equipoc_marca)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Modelo
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.equipo_modelo)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Número de Serie
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.numero_serie)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Procesador
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.procesador)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  RAM
                </label>
                <p className="text-gray-900">{formatValue(solicitud.ram)}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Almacenamiento
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.almacenamiento)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Sistema Operativo
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.sistema_operativo)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Estado del Equipo
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.estado_equipo)}
                </p>
              </div>
            </div>
          </div>{" "}
          {/* Información de la Solicitud */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Información de la Solicitud
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Estado
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                    solicitud.estado
                  )}`}
                >
                  {formatValue(solicitud.estado)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Fecha de Solicitud
                </label>
                <p className="text-gray-900">
                  {formatDate(solicitud.fecha_solicitud)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Fecha de Respuesta
                </label>
                <p className="text-gray-900">
                  {formatDate(solicitud.fecha_respuesta)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Procesado por
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.procesado_por)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Especialidad TI
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.especialidad_ti)}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Observaciones TI
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.observaciones_ti)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipoDetailModal;
