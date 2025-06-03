import { FaPlus } from "react-icons/fa";

interface AccessHeaderProps {
  onNewAccess: () => void;
}

const AccessHeader = ({ onNewAccess }: AccessHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Accesos</h1>
        <p className="text-gray-600 mt-2">
          Administra permisos y accesos del sistema
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onNewAccess}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Nuevo Acceso</span>
        </button>
      </div>
    </div>
  );
};

export default AccessHeader;
