import { useState, useEffect } from "react";
import { FaDesktop, FaSpinner } from "react-icons/fa";
import type { EquipmentDetails } from "../interfaces/SolicitudTI";
import { API_BASE_URL } from "../../services/apiService";

interface EquipmentInfoProps {
  solicitudId: number;
  sectionTitle: string;
}

const EquipmentInfo = ({ solicitudId, sectionTitle }: EquipmentInfoProps) => {
  const [equipmentDetails, setEquipmentDetails] =
    useState<EquipmentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Solo hacer fetch para solicitudes de computadoras
    if (sectionTitle !== "Solicitudes de Computadores") {
      return;
    }

    const fetchEquipmentDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/equipos/solicitudes/${solicitudId}/detalle`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Verificar que la respuesta tenga la estructura esperada
        if (result.success && result.data) {
          // Mapear los campos de la respuesta al formato de EquipmentDetails
          const mappedData: EquipmentDetails = {
            equipo_id: result.data.id,
            tipo_equipo: result.data.tipo,
            marca: result.data.marca,
            modelo: result.data.modelo,
            numero_serie: result.data.numero_serie,
            especificaciones: `Procesador: ${result.data.procesador}, RAM: ${result.data.ram}, Almacenamiento: ${result.data.almacenamiento}, SO: ${result.data.sistema_operativo}`,
            estado_equipo: result.data.estado,
            fecha_asignacion: result.data.fecha_adquisicion,
            observaciones: result.data.observaciones,
            ubicacion: undefined, // No viene en la respuesta
            valor_estimado: undefined, // No viene en la respuesta
            garantia_hasta: undefined, // No viene en la respuesta
            proveedor: undefined, // No viene en la respuesta
          };

          setEquipmentDetails(mappedData);
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } catch (err) {
        console.error("Error fetching equipment details:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentDetails();
  }, [solicitudId, sectionTitle]);
  // Solo mostrar para solicitudes de computadoras
  if (sectionTitle !== "Solicitudes de Computadores") {
    return null;
  }

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    return String(value);
  };
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("es-ES");
    } catch {
      return dateString;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "disponible":
        return "bg-green-100 text-green-800";
      case "asignado":
        return "bg-blue-100 text-blue-800";
      case "en_mantenimiento":
        return "bg-yellow-100 text-yellow-800";
      case "fuera_de_servicio":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <FaDesktop className="text-blue-600" />
        <h4 className="text-md font-semibold text-gray-800">
          Información del Equipo
        </h4>
      </div>
      {loading && (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">
            Cargando información del equipo...
          </span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            Error al cargar los detalles del equipo: {error}
          </p>
        </div>
      )}{" "}
      {equipmentDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              ID Equipo
            </label>
            <p className="text-gray-900">
              #{formatValue(equipmentDetails.equipo_id)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tipo de Equipo
            </label>
            <p className="text-gray-900">
              {formatValue(equipmentDetails.tipo_equipo)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Marca
            </label>
            <p className="text-gray-900">
              {formatValue(equipmentDetails.marca)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Modelo
            </label>
            <p className="text-gray-900">
              {formatValue(equipmentDetails.modelo)}
            </p>
          </div>

          {equipmentDetails.numero_serie && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Número de Serie
              </label>
              <p className="text-gray-900">
                {formatValue(equipmentDetails.numero_serie)}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Estado del Equipo
            </label>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                equipmentDetails.estado_equipo
              )}`}
            >
              {formatValue(equipmentDetails.estado_equipo)}
            </span>
          </div>

          {equipmentDetails.especificaciones && (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Especificaciones Técnicas
              </label>
              <p className="text-gray-900">
                {formatValue(equipmentDetails.especificaciones)}
              </p>
            </div>
          )}

          {equipmentDetails.fecha_asignacion && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Fecha de Adquisición
              </label>
              <p className="text-gray-900">
                {formatDate(equipmentDetails.fecha_asignacion)}
              </p>
            </div>
          )}

          {equipmentDetails.observaciones && (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Observaciones
              </label>
              <p className="text-gray-900">
                {formatValue(equipmentDetails.observaciones)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EquipmentInfo;
