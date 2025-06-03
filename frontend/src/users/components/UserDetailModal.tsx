import type { SolicitudUsuario } from "../interfaces";

interface UserDetailModalProps {
  isOpen: boolean;
  solicitud: SolicitudUsuario | null;
  onClose: () => void;
}

const UserDetailModal = ({
  isOpen,
  solicitud,
  onClose,
}: UserDetailModalProps) => {
  if (!isOpen || !solicitud) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {" "}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalles de Solicitud - {solicitud.nombre}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                ID
              </label>
              <p className="text-gray-900">{solicitud.id}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Tipo Solicitud
              </label>
              <p className="text-gray-900">{solicitud.tipo_solicitud}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Nombre
              </label>
              <p className="text-gray-900">{solicitud.nombre}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Email
              </label>
              <p className="text-gray-900">{solicitud.email}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Área
              </label>
              <p className="text-gray-900">{solicitud.area}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Rol
              </label>
              <p className="text-gray-900">{solicitud.rol}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
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
              <label className="block text-sm font-bold text-gray-700">
                Fecha Solicitud
              </label>
              <p className="text-gray-900">
                {formatDate(solicitud.fecha_solicitud)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Fecha Respuesta
              </label>
              <p className="text-gray-900">
                {solicitud.fecha_respuesta
                  ? formatDate(solicitud.fecha_respuesta)
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Procesado Por
              </label>
              <p className="text-gray-900">
                {solicitud.procesado_por || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Especialidad TI
              </label>
              <p className="text-gray-900">
                {solicitud.especialidad_ti || "N/A"}
              </p>
            </div>
          </div>{" "}
          <div>
            <label className="block text-sm font-bold text-gray-700">
              Observaciones TI
            </label>
            <p className="text-gray-900 mt-1">
              {solicitud.observaciones_ti || "Sin observaciones"}
            </p>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
