import type { SolicitudAcceso } from "../interfaces";

interface AccessDetailModalProps {
  isOpen: boolean;
  solicitud: SolicitudAcceso | null;
  onClose: () => void;
}

const AccessDetailModal = ({
  isOpen,
  solicitud,
  onClose,
}: AccessDetailModalProps) => {
  if (!isOpen || !solicitud) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("es-ES");
    } catch {
      return dateString;
    }
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Detalles de Solicitud de Acceso
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ID Solicitud
              </label>
              <p className="text-gray-900">
                {solicitud.solicitud_id || solicitud.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Usuario Solicitante
              </label>
              <p className="text-gray-900">{solicitud.usuario_nombre}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email del Usuario
              </label>
              <p className="text-gray-900">{solicitud.usuario_email}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Área
              </label>
              <p className="text-gray-900">{solicitud.usuario_area}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Rol
              </label>
              <p className="text-gray-900">{solicitud.usuario_rol}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Permiso Solicitado
              </label>
              <p className="text-gray-900">{solicitud.nombre_permiso}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Estado
              </label>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                  solicitud.estado
                )}`}
              >
                {solicitud.estado}
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
            {solicitud.lider_solicitante_nombre && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Líder Solicitante
                </label>
                <p className="text-gray-900">
                  {solicitud.lider_solicitante_nombre}
                </p>
              </div>
            )}
            {solicitud.permiso_categoria && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Categoría del Permiso
                </label>
                <p className="text-gray-900">{solicitud.permiso_categoria}</p>
              </div>
            )}
            {solicitud.fecha_respuesta && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Fecha de Respuesta
                </label>
                <p className="text-gray-900">
                  {formatDate(solicitud.fecha_respuesta)}
                </p>
              </div>
            )}
            {solicitud.procesado_por && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Procesado Por
                </label>
                <p className="text-gray-900">{solicitud.procesado_por}</p>
              </div>
            )}
            {solicitud.fecha_aprobacion && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Fecha de Aprobación
                </label>
                <p className="text-gray-900">
                  {formatDate(solicitud.fecha_aprobacion)}
                </p>
              </div>
            )}
            {solicitud.fecha_rechazo && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Fecha de Rechazo
                </label>
                <p className="text-gray-900">
                  {formatDate(solicitud.fecha_rechazo)}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Especialidad TI
              </label>
              <p className="text-gray-900">
                {solicitud.especialidad_ti || "N/A"}
              </p>
            </div>
          </div>{" "}
          {solicitud.permiso_descripcion && (
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Descripción del Permiso
              </label>
              <p className="text-gray-900">{solicitud.permiso_descripcion}</p>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Observaciones TI
            </label>
            <p className="text-gray-900">
              {solicitud.observaciones_ti || "Sin observaciones"}
            </p>
          </div>
          {solicitud.motivo_rechazo && (
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Motivo de Rechazo
              </label>
              <p className="text-gray-900 bg-red-50 p-3 rounded-lg">
                {solicitud.motivo_rechazo}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDetailModal;
