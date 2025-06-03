import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import type { SolicitudTI, SectionData, SectionType } from "../interfaces";
import {
  DetallesSolicitudModal,
  StatsCards,
  SearchBar,
  SectionTabs,
  SolicitudesTable,
  Pagination,
} from "../components";

const Aprobaciones = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("usuarios");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] =
    useState<SolicitudTI | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<SectionData>({
    usuarios: [],
    accesos: [],
    equipos: [],
  });
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const itemsPerPage = 10;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos  // Solo hacer fetch una vez al cargar la página o si los datos son muy antiguos
  useEffect(() => {
    const now = Date.now();
    const shouldFetch =
      lastFetchTime === 0 || now - lastFetchTime > CACHE_DURATION;

    if (shouldFetch) {
      fetchAllData();
    }
  }, [lastFetchTime, CACHE_DURATION]);

  // Reset página cuando se cambia de sección o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection, searchTerm]);
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";

      // Función para obtener datos de un endpoint individual con manejo de errores
      const fetchEndpointData = async (
        url: string,
        endpointName: string
      ): Promise<SolicitudTI[]> => {
        try {
          const response = await fetch(url);

          if (!response.ok) {
            if (response.status === 404) {
              console.warn(`⚠️ ${endpointName}: No hay solicitudes (404)`);
              return [];
            }
            throw new Error(
              `${endpointName}: ${response.status} ${response.statusText}`
            );
          }
          const data = await response.json();
          const processedData = Array.isArray(data) ? data : data.data || [];
          return processedData;
        } catch (error) {
          console.error(`❌ Error en ${endpointName}:`, error);
          return []; // Retornar array vacío en caso de error
        }
      };

      const usuariosData = await fetchEndpointData(
        `${API_BASE_URL}/ti/usuarios/solicitudes`,
        "Usuarios"
      );

      const accesosData = await fetchEndpointData(
        `${API_BASE_URL}/ti/accesos/solicitudes`,
        "Accesos"
      );

      const equiposData = await fetchEndpointData(
        `${API_BASE_URL}/ti/equipos/solicitudes`,
        "Equipos"
      );

      const allSolicitudes = [...usuariosData, ...accesosData, ...equiposData];

      // Procesar y filtrar datos por tipo_solicitud
      const processAndFilterData = (solicitudes: SolicitudTI[]) => {
        const usuarios = solicitudes.filter((item) => {
          if (!item.id && !item.solicitud_id) return false;
          if (!item.tipo_solicitud) return false;
          const tipo = item.tipo_solicitud.toLowerCase().trim();
          return tipo === "usuario" || tipo === "usuarios";
        });

        const accesos = solicitudes.filter((item) => {
          if (!item.id && !item.solicitud_id) return false;
          if (!item.tipo_solicitud) return false;
          const tipo = item.tipo_solicitud.toLowerCase().trim();
          return tipo === "acceso" || tipo === "accesos";
        });

        const equipos = solicitudes.filter((item) => {
          if (!item.id && !item.solicitud_id) return false;
          if (!item.tipo_solicitud) return false;
          const tipo = item.tipo_solicitud.toLowerCase().trim();
          return (
            tipo === "equipo" ||
            tipo === "equipos" ||
            tipo === "computador" ||
            tipo === "computadora"
          );
        });

        return { usuarios, accesos, equipos };
      };

      const processedData = processAndFilterData(allSolicitudes);
      setData(processedData);
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setData({ usuarios: [], accesos: [], equipos: [] });
    } finally {
      setLoading(false);
    }
  };
  const getCurrentData = () => {
    return data[activeSection] || [];
  };

  const getFilteredData = () => {
    const currentData = getCurrentData();
    if (!searchTerm.trim()) {
      return currentData;
    }

    const searchLower = searchTerm.toLowerCase();
    return currentData.filter((solicitud) => {
      const searchableFields = [
        solicitud.solicitante_nombre,
        solicitud.solicitante_email,
        solicitud.estado,
        solicitud.cargo_solicitado,
        solicitud.departamento,
        solicitud.justificacion,
        solicitud.observaciones_ti,
      ];

      return searchableFields.some(
        (field) => field && field.toString().toLowerCase().includes(searchLower)
      );
    });
  };

  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    const total = filteredData.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, total);
    const data = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return {
      data,
      total,
      startIndex: startIndex + 1,
      endIndex,
    };
  };

  const handleSectionChange = (section: SectionType) => {
    setActiveSection(section);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (solicitud: SolicitudTI) => {
    setSelectedSolicitud(solicitud);
    setIsDetailModalOpen(true);
  };
  const handleApprove = async (solicitudId: string, observaciones: string) => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";

      // Determinar el endpoint según la sección activa
      let endpoint = "";
      switch (activeSection) {
        case "usuarios":
          endpoint = `${API_BASE_URL}/ti/solicitudes/usuarios/${solicitudId}`;
          break;
        case "accesos":
          endpoint = `${API_BASE_URL}/ti/solicitudes/accesos/${solicitudId}`;
          break;
        case "equipos":
          endpoint = `${API_BASE_URL}/ti/solicitudes/equipos/${solicitudId}`;
          break;
        default:
          throw new Error("Sección no válida");
      }

      // Crear el payload con el formato requerido
      const payload = {
        estado: "aprobado",
        fecha_respuesta: new Date().toISOString(),
        procesado_por_ti_id: 1,
        observaciones_ti: observaciones,
      };

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Error ${response.status}: ${
            errorData.message || response.statusText
          }`
        );
      }

      // Manejar respuesta exitosa (204 No Content)
      if (response.status === 204) {
        // Success - no content to parse
      } else {
        await response.json();
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Solicitud aprobada exitosamente",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Refrescar datos después de la acción
      fetchAllData();
    } catch (error) {
      console.error("❌ Error al aprobar solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al aprobar la solicitud: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    }
  };

  const handleReject = async (solicitudId: string, observaciones: string) => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";

      // Determinar el endpoint según la sección activa
      let endpoint = "";
      switch (activeSection) {
        case "usuarios":
          endpoint = `${API_BASE_URL}/ti/solicitudes/usuarios/${solicitudId}`;
          break;
        case "accesos":
          endpoint = `${API_BASE_URL}/ti/solicitudes/accesos/${solicitudId}`;
          break;
        case "equipos":
          endpoint = `${API_BASE_URL}/ti/solicitudes/equipos/${solicitudId}`;
          break;
        default:
          throw new Error("Sección no válida");
      }

      // Crear el payload con el formato requerido
      const payload = {
        estado: "rechazado",
        fecha_respuesta: new Date().toISOString(),
        procesado_por_ti_id: 1,
        observaciones_ti: observaciones,
      };

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Error ${response.status}: ${
            errorData.message || response.statusText
          }`
        );
      }

      // Manejar respuesta exitosa (204 No Content)
      if (response.status === 204) {
        // Success - no content to parse
      } else {
        await response.json();
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Solicitud rechazada exitosamente",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Refrescar datos después de la acción
      fetchAllData();
    } catch (error) {
      console.error("❌ Error al rechazar solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al rechazar la solicitud: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    }
  };

  const getStatistics = (sectionData: SolicitudTI[]) => {
    return {
      total: sectionData.length,
      pendientes: sectionData.filter(
        (s) => s.estado.toLowerCase() === "pendiente"
      ).length,
      aprobadas: sectionData.filter(
        (s) =>
          s.estado.toLowerCase() === "aprobada" ||
          s.estado.toLowerCase() === "aprobado"
      ).length,
      rechazadas: sectionData.filter(
        (s) =>
          s.estado.toLowerCase() === "rechazada" ||
          s.estado.toLowerCase() === "rechazado"
      ).length,
    };
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "usuarios":
        return "Aprobación de Usuarios";
      case "accesos":
        return "Solicitudes de Accesos";
      case "equipos":
        return "Solicitudes de Computadores";
      default:
        return "";
    }
  };

  const paginatedData = getPaginatedData();
  const totalPages = Math.ceil(paginatedData.total / itemsPerPage);
  const currentStats = getStatistics(getCurrentData());

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Centro de Aprobaciones TI
          </h1>{" "}
          <p className="text-gray-600 mt-2">
            Gestiona todas las solicitudes pendientes de aprobación
          </p>
        </div>
      </div>{" "}
      {/* Section Tabs */}
      <SectionTabs
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      {/* Current Section Title */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        {" "}
        <h2 className="text-xl font-semibold text-blue-800">
          {getSectionTitle()}
        </h2>
      </div>{" "}
      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />{" "}
      {/* Statistics Cards */}
      <StatsCards stats={currentStats} /> {/* Data Table */}
      <SolicitudesTable
        data={paginatedData.data}
        searchTerm={searchTerm}
        onViewDetails={handleViewDetails}
      />{" "}
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={paginatedData.total}
        itemsPerPage={itemsPerPage}
        startIndex={paginatedData.startIndex}
        endIndex={paginatedData.endIndex}
        onPageChange={handlePageChange}
      />
      {/* Details Modal */}
      <DetallesSolicitudModal
        isOpen={isDetailModalOpen}
        solicitud={selectedSolicitud}
        sectionTitle={getSectionTitle()}
        onClose={() => setIsDetailModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default Aprobaciones;
