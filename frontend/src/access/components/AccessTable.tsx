import type { SolicitudAcceso } from "../interfaces";

interface AccessTableProps {
  solicitudes: SolicitudAcceso[];
  searchTerm: string;
  onViewDetails: (solicitud: SolicitudAcceso) => void;
}

const AccessTable = ({
  solicitudes,
  searchTerm,
  onViewDetails,
}: AccessTableProps) => {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("es-ES");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {" "}
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Usuario
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Rol
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Acceso
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Estado
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Fecha Solicitud
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {" "}
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "No se encontraron solicitudes"
                    : "No hay solicitudes"}
                </td>
              </tr>
            ) : (
              solicitudes.map((solicitud) => (
                <tr
                  key={solicitud.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {solicitud.usuario_nombre}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {solicitud.usuario_rol}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {solicitud.nombre_permiso}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                        solicitud.estado
                      )}`}
                    >
                      {solicitud.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatDate(solicitud.fecha_solicitud)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onViewDetails(solicitud)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessTable;
