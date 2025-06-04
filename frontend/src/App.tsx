import "./App.css";
import { useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RecentRequests from "./components/RecentRequests";
import Usuarios from "./users/pages/Usuarios";
import Accesos from "./access/pages/Accesos";
import Computadores from "./computers/pages/Computadores";
import Aprobaciones from "./approvals/pages/Aprobaciones";

// Home component
const Home = () => (
  <div>
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Gestión de Nuevos Colaboradores
      </h1>
      <p className="text-gray-600">
        Bienvenido al sistema de gestión de nuevos colaboradores
      </p>
    </div>
    <RecentRequests />
  </div>
);

// 404 Not Found component
const NotFound = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-gray-600 mb-4">Página no encontrada</p>
    <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
      Volver al inicio
    </Link>
  </div>
);

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const handleSidebarToggle = (isCollapsed: boolean) => {
    setSidebarCollapsed(isCollapsed);
  };

  // Check if current page is aprobaciones
  const isAprobacionesPage = location.pathname === "/aprobaciones";

  // Render Aprobaciones page without sidebar
  if (isAprobacionesPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <Routes>
              <Route path="/aprobaciones" element={<Aprobaciones />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
  // Render other pages with sidebar
  return (
    <>
      <Sidebar onToggle={handleSidebarToggle} />
      <div
        className={`${
          sidebarCollapsed ? "ml-16" : "ml-64"
        } min-h-screen bg-gray-50 transition-all duration-500 ease-in-out`}
      >
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            {" "}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/accesos" element={<Accesos />} />
              <Route path="/computadores" element={<Computadores />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
