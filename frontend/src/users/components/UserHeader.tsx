import { FaPlus } from "react-icons/fa";

interface UserHeaderProps {
  onNewUser: () => void;
}

const UserHeader = ({ onNewUser }: UserHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Solicitudes de Usuarios
        </h1>
        <p className="text-gray-600 mt-2">
          Administra las solicitudes de creación de usuarios
        </p>
      </div>
      <button
        onClick={onNewUser}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
      >
        <FaPlus />
        <span>Nueva Solicitud</span>
      </button>
    </div>
  );
};

export default UserHeader;
