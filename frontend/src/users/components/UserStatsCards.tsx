import { FaEquals, FaQuestion, FaCheck, FaTimes } from "react-icons/fa";
import type { SolicitudUsuario } from "../interfaces";

interface UserStatsCardsProps {
  solicitudes: SolicitudUsuario[];
}

const UserStatsCards = ({ solicitudes }: UserStatsCardsProps) => {
  const totalSolicitudes = solicitudes.length;
  const pendientes = solicitudes.filter((s) => s.estado === "pendiente").length;
  const aprobadas = solicitudes.filter((s) => s.estado === "aprobado").length;
  const rechazadas = solicitudes.filter((s) => s.estado === "rechazado").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3">
            <FaEquals className="text-blue-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Solicitudes</p>
            <p className="text-2xl font-bold text-gray-800">
              {totalSolicitudes}
            </p>
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
            <p className="text-2xl font-bold text-gray-800">{pendientes}</p>
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
            <p className="text-2xl font-bold text-gray-800">{aprobadas}</p>
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
            <p className="text-2xl font-bold text-gray-800">{rechazadas}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCards;
