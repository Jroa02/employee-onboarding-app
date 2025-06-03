import type { SectionType } from "../interfaces";

interface SectionTabsProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const SectionTabs = ({ activeSection, onSectionChange }: SectionTabsProps) => {
  const handleSectionClick = (section: SectionType) => {
    onSectionChange(section);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <div className="flex space-x-1">
        <button
          onClick={() => handleSectionClick("usuarios")}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
            activeSection === "usuarios"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Aprobación de Usuarios
        </button>
        <button
          onClick={() => handleSectionClick("accesos")}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
            activeSection === "accesos"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Solicitudes de Accesos
        </button>
        <button
          onClick={() => handleSectionClick("equipos")}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
            activeSection === "equipos"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Solicitudes de Computadores
        </button>
      </div>
    </div>
  );
};

export default SectionTabs;
