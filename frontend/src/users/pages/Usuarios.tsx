import { useState, useEffect } from "react";
import type { SolicitudUsuario, ApiResponse } from "../interfaces";
import { API_BASE_URL } from "../../services/apiService";
import {
  UserModal,
  UserHeader,
  UserSearchBar,
  UserStatsCards,
  UserTable,
  UserPagination,
  UserDetailModal,
} from "../components";

const Usuarios = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudUsuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] =
    useState<SolicitudUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSolicitudes();
  }, []);
  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/lideres/1/usuarios/solicitudes`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setSolicitudes(data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar solicitudes"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleUserCreated = () => {
    fetchSolicitudes(); // Refresh the list
  };

  const handleNewUser = () => {
    setIsModalOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (solicitud: SolicitudUsuario) => {
    setSelectedSolicitud(solicitud);
  };
  const filteredSolicitudes = solicitudes.filter(
    (solicitud) =>
      solicitud.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.email.toLowerCase().includes(searchTerm.toLowerCase())
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <UserHeader onNewUser={handleNewUser} />
      {/* Statistics Cards */}
      <UserStatsCards solicitudes={solicitudes} />
      {/* Search Bar */}
      <UserSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      {/* Requests Table */}
      <UserTable
        solicitudes={currentSolicitudes}
        searchTerm={searchTerm}
        onViewDetails={handleViewDetails}
        isLoading={isLoading}
        error={error}
      />{" "}
      {/* Pagination */}
      {!isLoading && !error && filteredSolicitudes.length > itemsPerPage && (
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSolicitudes.length}
          startIndex={startIndex + 1}
          endIndex={Math.min(endIndex, filteredSolicitudes.length)}
          onPageChange={handlePageChange}
        />
      )}
      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
      {/* Detail Modal */}
      <UserDetailModal
        isOpen={selectedSolicitud !== null}
        solicitud={selectedSolicitud}
        onClose={() => setSelectedSolicitud(null)}
      />
    </div>
  );
};

export default Usuarios;
