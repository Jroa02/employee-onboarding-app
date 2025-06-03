import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaKey, FaDesktop, FaBars } from "react-icons/fa";

interface SidebarProps {
  onToggle: (isCollapsed: boolean) => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname.slice(1) || "home";

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onToggle(newCollapsedState);
  };

  const menuItems = [
    { id: "home", icon: FaHome, label: "Inicio", path: "/" },
    { id: "usuarios", icon: FaUsers, label: "Usuarios", path: "/usuarios" },
    { id: "accesos", icon: FaKey, label: "Accesos", path: "/accesos" },
    {
      id: "computadores",
      icon: FaDesktop,
      label: "Computadores",
      path: "/computadores",
    },
  ];
  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white shadow-lg h-screen fixed left-0 top-0 border-r border-gray-200 transition-all duration-500 ease-in-out`}
    >
      <div
        className={`${
          isCollapsed ? "p-3" : "p-6"
        } transition-all duration-500 ease-in-out`}
      >
        {" "}
        {/* Toggle button */}{" "}
        <div className="flex justify-between items-center mb-8">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-gray-800 transition-opacity duration-500 ease-in-out text-center flex-1">
              Sistema de Gestión
            </h2>
          )}{" "}
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 ease-in-out"
          >
            <FaBars
              className={`${
                isCollapsed ? "text-xl" : "text-lg"
              } transition-all duration-300 ease-in-out`}
            />
          </button>
        </div>{" "}
        <nav className="space-y-2">
          {/* Home icon */}
          <Link
            to="/"
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center py-5 mx-1" : "space-x-3 px-4 py-3"
            } rounded-lg transition-all duration-200 ease-in-out ${
              currentPage === "home"
                ? isCollapsed
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 hover:shadow-md"
            }`}
            title={isCollapsed ? "Inicio" : ""}
          >
            <FaHome
              className={`${
                isCollapsed ? "text-xl" : "text-base"
              } transition-all duration-200 ease-in-out`}
            />
            {!isCollapsed && (
              <span className="font-medium transition-opacity duration-200 ease-in-out">
                Inicio
              </span>
            )}
          </Link>
          {/* Separator */}
          <div className="border-t border-gray-200 my-4"></div>
          {/* Navigation options */}
          {menuItems.slice(1).map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center ${
                  isCollapsed
                    ? "justify-center py-5 mx-1"
                    : "space-x-3 px-4 py-3"
                } rounded-lg transition-all duration-200 ease-in-out ${
                  currentPage === item.id
                    ? isCollapsed
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 hover:shadow-md"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <IconComponent
                  className={`${
                    isCollapsed ? "text-xl" : "text-base"
                  } transition-all duration-200 ease-in-out`}
                />
                {!isCollapsed && (
                  <span className="font-medium transition-opacity duration-200 ease-in-out">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
