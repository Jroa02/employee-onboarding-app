import { useState, useEffect } from "react";
import type { SolicitudAcceso } from "../interfaces";
import { API_BASE_URL } from "../../services/apiService";
import {
  AccessModal,
  AccessHeader,
  AccessSearchBar,
  AccessTable,
  AccessPagination,
  AccessStatsCards,
  AccessDetailModal,
} from "../components";

const Accesos = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudAcceso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] =
    useState<SolicitudAcceso | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSolicitudes();
  }, []);
  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/lideres/1/accesos/solicitudes`;

      console.log("Fetching from URL:", url);
      const response = await fetch(url);

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data); // Manejar diferentes estructuras de respuesta como en AccessModal
      let solicitudesData: SolicitudAcceso[] = [];

      if (Array.isArray(data)) {
        solicitudesData = data;
      } else if (data && Array.isArray(data.data)) {
        solicitudesData = data.data;
      } else if (data && Array.isArray(data.solicitudes)) {
        solicitudesData = data.solicitudes;
      } else if (data && Array.isArray(data.results)) {
        solicitudesData = data.results;
      } else {
        console.warn("Estructura de respuesta inesperada:", data);
        solicitudesData = [];
      }

      // Mapear los datos para agregar el campo id basado en solicitud_id
      const mappedSolicitudes = solicitudesData.map((solicitud) => ({
        ...solicitud,
        id: solicitud.solicitud_id, // Mapear solicitud_id a id para compatibilidad
      }));

      setSolicitudes(mappedSolicitudes);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessCreated = () => {
    fetchSolicitudes(); // Recargar datos después de crear nueva solicitud
    setIsModalOpen(false);
  };

  const handleViewDetails = (solicitud: SolicitudAcceso) => {
    setSelectedSolicitud(solicitud);
    setIsDetailModalOpen(true);
  };

  const handleNewAccess = () => {
    setIsModalOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredSolicitudes = solicitudes.filter(
    (solicitud) =>
      solicitud.usuario_nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      solicitud.nombre_permiso
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      solicitud.estado.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-xl text-gray-600">Cargando solicitudes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AccessHeader onNewAccess={handleNewAccess} />
      {/* Statistics Cards */}
      <AccessStatsCards solicitudes={solicitudes} />
      {/* Search Bar */}
      <AccessSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />{" "}
      {/* Solicitudes Table */}
      <AccessTable
        solicitudes={currentSolicitudes}
        searchTerm={searchTerm}
        onViewDetails={handleViewDetails}
      />{" "}
      {/* Pagination */}
      {filteredSolicitudes.length > itemsPerPage && (
        <AccessPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSolicitudes.length}
          startIndex={startIndex + 1}
          endIndex={Math.min(endIndex, filteredSolicitudes.length)}
          onPageChange={handlePageChange}
        />
      )}
      {/* Access Modal */}
      <AccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccessCreated={handleAccessCreated}
      />{" "}
      {/* Details Modal */}
      <AccessDetailModal
        isOpen={isDetailModalOpen}
        solicitud={selectedSolicitud}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default Accesos;
