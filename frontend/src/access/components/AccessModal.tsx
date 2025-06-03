import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

interface Usuario {
  id: number;
  nombre: string;
  area: string;
  email: string;
  rol: string;
}

interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  activo: boolean;
  fecha_creacion: string;
}

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccessCreated: () => void;
}

const AccessModal = ({
  isOpen,
  onClose,
  onAccessCreated,
}: AccessModalProps) => {
  const [formData, setFormData] = useState({
    usuarioId: "",
    permisoId: "",
  });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);
  const [isLoadingPermisos, setIsLoadingPermisos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios aprobados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      fetchUsuariosAprobados();
    }
  }, [isOpen]); // Cargar permisos cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUser?.area) {
      console.log("Cargando permisos para área:", selectedUser.area);
      fetchPermisos(selectedUser.area);
    } else {
      console.log("No se puede cargar permisos. selectedUser:", selectedUser);
      setPermisos([]); // Limpiar permisos si no hay usuario seleccionado
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?.id]); // Solo se ejecuta cuando cambia el ID del usuario
  const fetchUsuariosAprobados = async () => {
    setIsLoadingUsuarios(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/usuarios/1/aprobado`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Respuesta de usuarios:", data); // Para debugging

      // Validar que la respuesta tenga la estructura esperada
      if (data.success && Array.isArray(data.data)) {
        setUsuarios(data.data);
      } else if (Array.isArray(data)) {
        // Fallback si viene como array directo
        setUsuarios(data);
      } else if (data && Array.isArray(data.usuarios)) {
        // Fallback para estructura { usuarios: [...] }
        setUsuarios(data.usuarios);
      } else {
        console.warn("Respuesta de usuarios no tiene formato esperado:", data);
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setUsuarios([]); // Asegurar que siempre sea un array
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error al cargar usuarios",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoadingUsuarios(false);
    }
  };
  const fetchPermisos = async (area: string) => {
    // Evitar llamadas duplicadas si ya se están cargando permisos
    if (isLoadingPermisos) {
      console.log("Ya se están cargando permisos, evitando llamada duplicada");
      return;
    }

    setIsLoadingPermisos(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const url = `${apiUrl}/permisos/${area}`;
      console.log("Llamando a URL de permisos:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Respuesta de permisos:", data); // Para debugging      // Validar que la respuesta tenga la estructura esperada
      if (data.success && Array.isArray(data.data)) {
        console.log("Permisos encontrados:", data.data.length);
        console.log("Primer permiso:", data.data[0]);
        console.log("Todos los permisos:", data.data);
        setPermisos(data.data);
      } else if (Array.isArray(data)) {
        // Fallback si viene como array directo
        console.log("Permisos (array directo):", data.length);
        setPermisos(data);
      } else if (data && Array.isArray(data.permisos)) {
        // Fallback para estructura { permisos: [...] }
        console.log("Permisos (propiedad permisos):", data.permisos.length);
        setPermisos(data.permisos);
      } else {
        console.warn("Respuesta de permisos no tiene formato esperado:", data);
        setPermisos([]);
      }
    } catch (err) {
      console.error("Error al cargar permisos:", err);
      setPermisos([]); // Asegurar que siempre sea un array
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error al cargar permisos",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoadingPermisos(false);
    }
  };
  const handleUsuarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const usuarioId = e.target.value;
    setFormData((prev) => ({ ...prev, usuarioId, permisoId: "" }));

    if (usuarioId && Array.isArray(usuarios)) {
      const usuario = usuarios.find((u) => u.id.toString() === usuarioId);
      console.log("Usuario seleccionado:", usuario);
      setSelectedUser(usuario || null);
    } else {
      console.log("No se seleccionó usuario válido. usuarioId:", usuarioId);
      setSelectedUser(null);
      setPermisos([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const dataToSend = {
        usuario_id: parseInt(formData.usuarioId),
        permiso_id: parseInt(formData.permisoId),
        lider_solicitante_id: 1,
      };

      console.log("Enviando solicitud de acceso:", dataToSend);
      const response = await fetch(`${apiUrl}/permisos/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      }); // Verificar que la respuesta sea exitosa (204 No Content)
      if (response.status !== 204) {
        let errorMessage = "Error al crear la solicitud de acceso";

        if (response.status >= 400 && response.status < 500) {
          errorMessage = "Datos inválidos o permisos insuficientes";
        } else if (response.status >= 500) {
          errorMessage = "Error del servidor. Intenta nuevamente";
        }

        throw new Error(errorMessage);
      }
      console.log("Solicitud de acceso creada exitosamente");

      // Reset form first
      setFormData({
        usuarioId: "",
        permisoId: "",
      });
      setSelectedUser(null);
      setPermisos([]); // Close modal first
      onAccessCreated();
      onClose(); // Show toast immediately after closing modal
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Solicitud creada exitosamente!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          console.log("Toast abierto exitosamente");
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear acceso";
      setError(errorMessage);

      // Show error toast
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error al crear acceso",
        text: errorMessage,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    setFormData({
      usuarioId: "",
      permisoId: "",
    });
    setSelectedUser(null);
    setPermisos([]);
    setError(null);
    onClose();
  };
  if (!isOpen) {
    return null;
  }

  // Debug: Ver permisos en el render
  console.log("Renderizando modal con permisos:", permisos);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Nuevo Acceso</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <select
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleUsuarioChange}
                required
                disabled={isLoadingUsuarios}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                style={{ color: "#111827", backgroundColor: "white" }}
              >
                <option
                  value=""
                  style={{ color: "#6B7280", backgroundColor: "white" }}
                >
                  {isLoadingUsuarios
                    ? "Cargando usuarios..."
                    : "Seleccionar usuario"}
                </option>
                {Array.isArray(usuarios) &&
                  usuarios.map((usuario) => (
                    <option
                      key={usuario.id}
                      value={usuario.id}
                      style={{ color: "#111827", backgroundColor: "white" }}
                    >
                      {usuario.nombre}
                    </option>
                  ))}
              </select>
            </div>
            {selectedUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área
                </label>
                <input
                  type="text"
                  value={selectedUser.area}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            )}{" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permiso
              </label>{" "}
              <select
                name="permisoId"
                value={formData.permisoId}
                onChange={handleInputChange}
                required
                disabled={!selectedUser || isLoadingPermisos}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                style={{ color: "#111827", backgroundColor: "white" }}
              >
                <option
                  value=""
                  style={{ color: "#6B7280", backgroundColor: "white" }}
                >
                  {!selectedUser
                    ? "Primero selecciona un usuario"
                    : isLoadingPermisos
                    ? "Cargando permisos..."
                    : `Seleccionar permiso (${permisos.length} disponibles)`}
                </option>{" "}
                {Array.isArray(permisos) &&
                  permisos.map((permiso) => (
                    <option
                      key={permiso.id}
                      value={permiso.id}
                      style={{ color: "#111827", backgroundColor: "white" }}
                    >
                      {permiso.descripcion || permiso.nombre}
                    </option>
                  ))}{" "}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando..." : "Crear Acceso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessModal;
