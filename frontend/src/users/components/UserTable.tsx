import type { SolicitudUsuario } from "../interfaces";

interface UserTableProps {
  solicitudes: SolicitudUsuario[];
  searchTerm: string;
  onViewDetails: (solicitud: SolicitudUsuario) => void;
  isLoading?: boolean;
  error?: string | null;
}

const UserTable = ({
  solicitudes,
  searchTerm,
  onViewDetails,
  isLoading = false,
  error = null,
}: UserTableProps) => {
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

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Cargando solicitudes...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Table
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Nombre
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 w-32">
                Rol
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
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
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
                    {solicitud.nombre}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{solicitud.email}</td>
                  <td className="py-3 px-4 max-w-48">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 block truncate"
                      title={solicitud.rol}
                    >
                      {solicitud.rol}
                    </span>
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
                  </td>{" "}
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

export default UserTable;
