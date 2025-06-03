import { useState, useEffect } from "react";
import { FaTimes, FaDesktop, FaUser, FaLaptop } from "react-icons/fa";
import type { Usuario, ComputadorForm, Equipo } from "../interfaces";

interface ComputadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ComputadorForm) => void;
}

const ComputadorModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ComputadorModalProps) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [formData, setFormData] = useState<ComputadorForm>({
    usuario_id: null,
    equipo_id: null,
    lider_solicitante_id: 1,
  });
  useEffect(() => {
    if (isOpen) {
      fetchUsuariosAprobados();
      fetchEquiposDisponibles();
    }
  }, [isOpen]);

  const fetchUsuariosAprobados = async () => {
    setLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_BASE_URL}/usuarios/1/aprobado`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsuarios(data.data || []);
    } catch (error) {
      console.error("Error al cargar usuarios aprobados:", error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquiposDisponibles = async () => {
    setLoadingEquipos(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_BASE_URL}/equipos/disponible`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEquipos(data.data || []);
    } catch (error) {
      console.error("Error al cargar equipos disponibles:", error);
      setEquipos([]);
    } finally {
      setLoadingEquipos(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // No cerramos el modal aquí, se maneja desde el componente padre
  };
  const handleClose = () => {
    setFormData({
      usuario_id: null,
      equipo_id: null,
      lider_solicitante_id: 1,
    });
    onClose();
  };

  const handleInputChange = (
    field: keyof ComputadorForm,
    value: string | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <FaDesktop className="text-blue-600 text-lg" />
            </div>{" "}
            <h2 className="text-xl font-semibold text-gray-800">
              Asignar Equipo a Usuario
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>{" "}
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selección de Usuario */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FaUser className="text-gray-600" />
              <span>Seleccionar Usuario</span>
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario a Asignar *
              </label>
              {loading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-500">Cargando usuarios...</span>
                </div>
              ) : (
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.usuario_id || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "usuario_id",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                >
                  <option value="">Seleccionar usuario...</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Solo se muestran usuarios aprobados
              </p>
            </div>
          </div>

          {/* Selección de Equipo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FaLaptop className="text-gray-600" />
              <span>Seleccionar Equipo</span>
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipo Disponible *
              </label>
              {loadingEquipos ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-500">Cargando equipos...</span>
                </div>
              ) : (
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.equipo_id || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "equipo_id",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                >
                  <option value="">Seleccionar equipo...</option>
                  {equipos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.tipo} - {equipo.modelo} | RAM: {equipo.ram} |
                      Almacenamiento: {equipo.almacenamiento} | SO:{" "}
                      {equipo.sistema_operativo}
                    </option>
                  ))}
                </select>
              )}{" "}
              <p className="text-xs text-gray-500 mt-1">
                Solo se muestran equipos disponibles
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancelar
            </button>{" "}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FaDesktop />
              <span>Asignar Equipo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComputadorModal;
