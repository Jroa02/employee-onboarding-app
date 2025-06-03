import { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEquals,
  FaQuestion,
  FaCheck,
  FaTimes,
  FaCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  ComputadorModal,
  EquipoDetailModal,
  EquipoPagination,
  HistorialAsignacionModal,
} from "../components";
import type { ComputadorForm, SolicitudEquipo } from "../interfaces";

const Computadores = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudEquipo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isHistorialModalOpen, setIsHistorialModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] =
    useState<SolicitudEquipo | null>(null);
  const [selectedSolicitudIdForHistorial, setSelectedSolicitudIdForHistorial] =
    useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(
        `${API_BASE_URL}/lideres/1/equipos/solicitudes`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSolicitudes(data.data || data || []);
    } catch (err) {
      console.error("Error al cargar solicitudes de equipos:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComputer = async (data: ComputadorForm) => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_BASE_URL}/equipos/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: data.usuario_id,
          equipo_id: data.equipo_id,
          lider_solicitante_id: data.lider_solicitante_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      } // El endpoint responde con 204 (No Content) cuando es exitoso
      if (response.status === 204) {
        console.log("Asignación de equipo exitosa");

        // Cerrar modal y recargar datos inmediatamente
        setIsModalOpen(false);
        fetchSolicitudes();

        // Mostrar toast de éxito (sin await para que no bloquee)
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Equipo asignado exitosamente",
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        // Si hay contenido en la respuesta, lo procesamos
        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        // Cerrar modal y recargar datos inmediatamente
        setIsModalOpen(false);
        fetchSolicitudes();

        // Mostrar toast de éxito (sin await para que no bloquee)
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Equipo asignado exitosamente",
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al asignar equipo:", error);

      // Mostrar toast de error (sin await para que no bloquee)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al asignar el equipo. Por favor, intenta nuevamente.",
        toast: true,
        position: "top-end",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };
  const handleViewDetails = (solicitud: SolicitudEquipo) => {
    setSelectedSolicitud(solicitud);
    setIsDetailModalOpen(true);
  };
  const handleViewHistorial = (equipoId: number) => {
    setSelectedSolicitudIdForHistorial(equipoId);
    setIsHistorialModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredSolicitudes = solicitudes.filter(
    (solicitud) =>
      solicitud.usuario_nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      solicitud.usuario_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.equipo_modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSolicitudes = filteredSolicitudes.slice(startIndex, endIndex);

  // Reset página cuando se cambia el filtro de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "aprobado":
        return <FaCircle className="text-green-500 text-xs" />;
      case "pendiente":
        return <FaCircle className="text-yellow-500 text-xs" />;
      case "rechazado":
        return <FaCircle className="text-red-500 text-xs" />;
      default:
        return <FaCircle className="text-gray-500 text-xs" />;
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
  // Calcular estadísticas
  const stats = {
    total: error ? 0 : solicitudes.length,
    aprobadas: error
      ? 0
      : solicitudes.filter((s) => s.estado.toLowerCase() === "aprobado").length,
    pendientes: error
      ? 0
      : solicitudes.filter((s) => s.estado.toLowerCase() === "pendiente")
          .length,
    rechazadas: error
      ? 0
      : solicitudes.filter((s) => s.estado.toLowerCase() === "rechazado")
          .length,
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-xl text-gray-600">Cargando solicitudes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Computadores
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las solicitudes de equipos de cómputo
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Asignar Equipo</span>
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {" "}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <FaEquals className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Solicitudes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3">
              <FaQuestion className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.pendientes}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <FaCheck className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.aprobadas}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-full p-3">
              <FaTimes className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.rechazadas}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />{" "}
          <input
            type="text"
            placeholder="Buscar por usuario, área, estado o modelo..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* Equipment Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Usuario
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Área
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Equipo Modelo
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
            </thead>{" "}
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="text-red-600">
                      <p className="font-medium">Error al cargar los datos</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : currentSolicitudes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? "No se encontraron solicitudes"
                      : "No hay solicitudes de equipos"}
                  </td>
                </tr>
              ) : (
                currentSolicitudes.map((solicitud) => (
                  <tr
                    key={solicitud.solicitud_id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {solicitud.usuario_nombre}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {solicitud.usuario_area}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div>
                        <p className="font-medium">{solicitud.equipoc_marca}</p>
                        <p className="text-sm text-gray-500">
                          {solicitud.equipo_modelo}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(solicitud.estado)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            solicitud.estado
                          )}`}
                        >
                          {solicitud.estado}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(solicitud.fecha_solicitud)}
                    </td>{" "}
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(solicitud)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Ver Detalles
                        </button>{" "}
                        <button
                          onClick={() =>
                            handleViewHistorial(solicitud.equipo_id)
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Historial
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>{" "}
        </div>
      </div>{" "}
      {/* Pagination */}
      {!loading && !error && filteredSolicitudes.length > itemsPerPage && (
        <EquipoPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSolicitudes.length}
          startIndex={startIndex + 1}
          endIndex={Math.min(endIndex, filteredSolicitudes.length)}
          onPageChange={handlePageChange}
        />
      )}
      {/* Computer Management Modal */}
      <ComputadorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitComputer}
      />{" "}
      {/* Equipment Detail Modal */}
      <EquipoDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        solicitud={selectedSolicitud}
      />{" "}
      {/* Historial Asignacion Modal */}
      <HistorialAsignacionModal
        isOpen={isHistorialModalOpen}
        equipoId={selectedSolicitudIdForHistorial}
        onClose={() => setIsHistorialModalOpen(false)}
      />
    </div>
  );
};

export default Computadores;
