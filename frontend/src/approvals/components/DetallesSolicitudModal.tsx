import { useState } from "react";
import { FaTimes, FaCheck, FaTimes as FaXmark } from "react-icons/fa";
import type { SolicitudTI } from "../interfaces";
import PermissionInfo from "./PermissionInfo";
import EquipmentInfo from "./EquipmentInfo";
import EquipmentConflicts from "./EquipmentConflicts";

interface DetallesSolicitudModalProps {
  isOpen: boolean;
  solicitud: SolicitudTI | null;
  sectionTitle: string;
  onClose: () => void;
  onApprove?: (solicitudId: string, observaciones: string) => void;
  onReject?: (solicitudId: string, observaciones: string) => void;
}

const DetallesSolicitudModal = ({
  isOpen,
  solicitud,
  sectionTitle,
  onClose,
  onApprove,
  onReject,
}: DetallesSolicitudModalProps) => {
  const [observaciones, setObservaciones] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !solicitud) return null;

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
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("es-ES");
    } catch {
      return dateString;
    }
  };
  // Función para formatear valores y mostrar N/A cuando sea necesario
  const formatValue = (value: unknown, isDateField = false): string => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    if (isDateField && typeof value === "string") {
      return formatDate(value);
    }
    return String(value);
  };
  const getFieldLabel = (fieldKey: string) => {
    const fieldMappings: { [key: string]: string } = {
      beneficiario_nombre: "Usuario Nombre",
      beneficiario_area: "Usuario Área",
      beneficiario_id: "Usuario Id",
      beneficiario_email: "Usuario Email",
      beneficiario_rol: "Usuario Rol",
      usuario_nombre: "Usuario Nombre",
      usuario_area: "Usuario Área",
    };

    return (
      fieldMappings[fieldKey] ||
      fieldKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };
  const handleApprove = async () => {
    if (!observaciones.trim()) {
      alert("Por favor ingresa observaciones antes de aprobar");
      return;
    }
    setIsSubmitting(true);
    try {
      await onApprove?.(String(solicitud.solicitud_id), observaciones);
      setObservaciones("");
      handleClose();
    } catch (error) {
      console.error("Error al aprobar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReject = async () => {
    if (!observaciones.trim()) {
      alert("Por favor ingresa observaciones antes de rechazar");
      return;
    }
    setIsSubmitting(true);
    try {
      await onReject?.(String(solicitud.solicitud_id), observaciones);
      setObservaciones("");
      handleClose();
    } catch (error) {
      console.error("Error al rechazar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setObservaciones("");
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto m-4">
        {" "}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalles de Solicitud - {sectionTitle}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex">
          {/* Columna izquierda - Detalles de la solicitud */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Información de la Solicitud
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              {/* Información básica */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  ID Solicitud
                </label>
                <p className="text-gray-900">
                  #{formatValue(solicitud.solicitud_id)}
                </p>
              </div>{" "}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Estado
                </label>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                    solicitud.estado
                  )}`}
                >
                  {formatValue(solicitud.estado)}
                </span>
              </div>{" "}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Líder Solicitante
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.lider_nombre)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Área del Líder
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.lider_area)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Usuario
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.beneficiario_nombre)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Área del Usuario
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.beneficiario_area)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Fecha de Solicitud
                </label>
                <p className="text-gray-900">
                  {formatValue(solicitud.fecha_solicitud, true)}
                </p>
              </div>{" "}
              {/* Mostrar campos adicionales específicos por tipo */}
              {Object.entries(solicitud).map(([key, value]) => {
                // Excluir campos ya mostrados
                if (
                  [
                    "id",
                    "solicitud_id",
                    "estado",
                    "lider_nombre",
                    "lider_area",
                    "beneficiario_nombre",
                    "beneficiario_area",
                    "fecha_solicitud",
                  ].includes(key)
                ) {
                  return null;
                }

                // Mostrar todos los campos, incluso los que son null/vacíos
                return (
                  <div key={key}>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {getFieldLabel(key)}
                    </label>
                    <p className="text-gray-900">
                      {formatValue(value, key.includes("fecha"))}
                    </p>
                  </div>
                );
              })}
            </div>{" "}
            {/* Información del permiso para solicitudes de acceso */}
            <PermissionInfo
              solicitudId={solicitud.solicitud_id}
              sectionTitle={sectionTitle}
            />
            {/* Información del equipo para solicitudes de computadoras */}
            <EquipmentInfo
              solicitudId={solicitud.solicitud_id}
              sectionTitle={sectionTitle}
            />
          </div>

          {/* Columna derecha - Formulario de acciones */}
          <div className="w-80 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Acciones de Aprobación
            </h3>
            {/* Campo de observaciones */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Observaciones *
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Escribe tus observaciones aquí..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Las observaciones son obligatorias
              </p>
            </div>
            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={handleApprove}
                disabled={isSubmitting || !observaciones.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <FaCheck />
                <span>
                  {isSubmitting ? "Procesando..." : "Aprobar Solicitud"}
                </span>
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || !observaciones.trim()}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <FaXmark />
                <span>
                  {isSubmitting ? "Procesando..." : "Rechazar Solicitud"}
                </span>
              </button>{" "}
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Cerrar
              </button>
            </div>{" "}
            {/* Estado actual de la solicitud */}
            <div className="mt-6 p-3 bg-white rounded-lg border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Estado Actual
              </h4>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                  solicitud.estado
                )}`}
              >
                {solicitud.estado}
              </span>
            </div>
            {/* Verificación de conflictos de equipo */}
            <div className="mt-4">
              <EquipmentConflicts
                solicitudId={solicitud.solicitud_id}
                sectionTitle={sectionTitle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesSolicitudModal;
