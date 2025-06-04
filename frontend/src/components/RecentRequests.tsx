import { useState, useEffect } from "react";
import { FaUsers, FaKey, FaDesktop } from "react-icons/fa";

interface BaseRequest {
  fecha_solicitud: string;
  estado: string;
}

interface UsuarioRequest extends BaseRequest {
  tipo_solicitud: "usuarios";
  id: number;
  nombre: string;
  area: string;
}

interface AccesoRequest extends BaseRequest {
  tipo_solicitud: "accesos";
  solicitud_id: number;
  usuario_nombre: string;
  usuario_area: string;
}

interface EquipoRequest extends BaseRequest {
  tipo_solicitud: "equipos";
  solicitud_id: number;
  usuario_nombre: string;
  usuario_area: string;
}

type Request = UsuarioRequest | AccesoRequest | EquipoRequest;

const RecentRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

        const [usuariosRes, accesosRes, equiposRes] = await Promise.all([
          fetch(`${API_URL}/lideres/1/usuarios/solicitudes`),
          fetch(`${API_URL}/lideres/1/accesos/solicitudes`),
          fetch(`${API_URL}/lideres/1/equipos/solicitudes`),
        ]);

        const [usuariosData, accesosData, equiposData] = await Promise.all([
          usuariosRes.json(),
          accesosRes.json(),
          equiposRes.json(),
        ]);

        const allRequests: Request[] = []; // Add usuarios requests (take first 3)
        if (usuariosData.success && usuariosData.data) {
          const usuariosRequests = usuariosData.data
            .slice(0, 3)
            .map((item: UsuarioRequest) => ({
              ...item,
              tipo_solicitud: "usuarios" as const,
            }));
          allRequests.push(...usuariosRequests);
        }

        // Add accesos requests (take first 3)
        if (accesosData.success && accesosData.data) {
          const accesosRequests = accesosData.data
            .slice(0, 3)
            .map((item: AccesoRequest) => ({
              ...item,
              tipo_solicitud: "accesos" as const,
            }));
          allRequests.push(...accesosRequests);
        }

        // Add equipos requests (take first 3)
        if (equiposData.success && equiposData.data) {
          const equiposRequests = equiposData.data
            .slice(0, 3)
            .map((item: EquipoRequest) => ({
              ...item,
              tipo_solicitud: "equipos" as const,
            }));
          allRequests.push(...equiposRequests);
        }

        // Sort by date (most recent first)
        allRequests.sort(
          (a, b) =>
            new Date(b.fecha_solicitud).getTime() -
            new Date(a.fecha_solicitud).getTime()
        );

        setRequests(allRequests);
      } catch (err) {
        setError("Error al cargar las solicitudes recientes");
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (estado: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (estado.toLowerCase()) {
      case "pendiente":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "aprobado":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rechazado":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };
  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "usuarios":
        return <FaUsers className="text-blue-600" size={20} />;
      case "accesos":
        return <FaKey className="text-green-600" size={20} />;
      case "equipos":
        return <FaDesktop className="text-purple-600" size={20} />;
      default:
        return <FaUsers className="text-gray-600" size={20} />;
    }
  };

  const getTypeName = (tipo: string) => {
    switch (tipo) {
      case "usuarios":
        return "Usuario";
      case "accesos":
        return "Acceso";
      case "equipos":
        return "Equipo";
      default:
        return tipo;
    }
  };

  const getRequestId = (request: Request) => {
    switch (request.tipo_solicitud) {
      case "usuarios":
        return request.id;
      case "accesos":
      case "equipos":
        return request.solicitud_id;
      default:
        return 0;
    }
  };

  const getRequestName = (request: Request) => {
    switch (request.tipo_solicitud) {
      case "usuarios":
        return request.nombre;
      case "accesos":
      case "equipos":
        return request.usuario_nombre;
      default:
        return "";
    }
  };

  const getRequestArea = (request: Request) => {
    switch (request.tipo_solicitud) {
      case "usuarios":
        return request.area;
      case "accesos":
      case "equipos":
        return request.usuario_area;
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Solicitudes Recientes
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Solicitudes Recientes
        </h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Solicitudes Recientes
      </h2>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay solicitudes recientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div
              key={`${request.tipo_solicitud}-${getRequestId(
                request
              )}-${index}`}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              {" "}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    {getTypeIcon(request.tipo_solicitud)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {getTypeName(request.tipo_solicitud)} #
                        {getRequestId(request)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900">
                      {getRequestName(request)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getRequestArea(request)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <span className={getStatusBadge(request.estado)}>
                      {request.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(request.fecha_solicitud)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRequests;
