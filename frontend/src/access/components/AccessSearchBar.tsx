import { FaSearch } from "react-icons/fa";

interface AccessSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const AccessSearchBar = ({
  searchTerm,
  onSearchChange,
}: AccessSearchBarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por usuario, acceso o estado..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AccessSearchBar;
