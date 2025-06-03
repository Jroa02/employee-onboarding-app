import { FaEquals, FaQuestion, FaCheck, FaTimes } from "react-icons/fa";
import type { SolicitudAcceso } from "../interfaces";

interface AccessStatsProps {
  solicitudes: SolicitudAcceso[];
}

const AccessStatsCards = ({ solicitudes }: AccessStatsProps) => {
  const stats = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(
      (s) => s.estado.toLowerCase() === "pendiente"
    ).length,
    aprobadas: solicitudes.filter(
      (s) =>
        s.estado.toLowerCase() === "aprobada" ||
        s.estado.toLowerCase() === "aprobado"
    ).length,
    rechazadas: solicitudes.filter(
      (s) =>
        s.estado.toLowerCase() === "rechazada" ||
        s.estado.toLowerCase() === "rechazado"
    ).length,
  };
  const statCards = [
    {
      title: "Total Solicitudes",
      value: stats.total,
      icon: FaEquals,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Pendientes",
      value: stats.pendientes,
      icon: FaQuestion,
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Aprobadas",
      value: stats.aprobadas,
      icon: FaCheck,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Rechazadas",
      value: stats.rechazadas,
      icon: FaTimes,
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className={`rounded-full p-3 ${card.color}`}>
                <IconComponent className={`${card.iconColor} text-xl`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccessStatsCards;
