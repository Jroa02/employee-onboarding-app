# Sistema de Gestión de Nuevos Colaboradores

Una aplicación web moderna para la gestión integral del proceso de onboarding de nuevos colaboradores, desarrollada con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Gestión de Usuarios**: Administración completa de nuevos colaboradores
- **Control de Accesos**: Gestión de permisos y accesos del sistema
- **Asignación de Equipos**: Control de solicitudes y asignación de equipos de cómputo
- **Sistema de Aprobaciones**: Flujo de aprobación para solicitudes de TI
- **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- **Navegación Intuitiva**: Sidebar colapsible con React Router
- **Notificaciones**: Sistema de alertas con SweetAlert2

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento del lado del cliente
- **Tailwind CSS** - Framework de CSS utilitario
- **React Icons** - Iconografía
- **SweetAlert2** - Alertas y notificaciones elegantes

## 📋 Prerrequisitos

- Node.js (versión 20 o superior)
- npm o yarn
- Backend API ejecutándose (por defecto en `http://localhost:3001`)

## 🔧 Instalación

1. **Clona el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd employee-onboarding-app/frontend
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**

   ```bash
   # Crea un archivo .env en la raíz del proyecto
   VITE_API_URL=http://localhost:3001
   ```

4. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abre tu navegador**

   Visita `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes globales
│   └── Sidebar.tsx     # Navegación lateral
├── users/              # Módulo de usuarios
│   ├── components/     # Componentes específicos
│   ├── interfaces/     # Tipos TypeScript
│   └── pages/          # Páginas del módulo
├── access/             # Módulo de accesos
│   ├── components/
│   ├── interfaces/
│   └── pages/
├── computers/          # Módulo de equipos
│   ├── components/
│   ├── interfaces/
│   └── pages/
├── approvals/          # Módulo de aprobaciones
│   ├── components/
│   ├── interfaces/
│   └── pages/
└── services/           # Servicios API
    └── apiService.ts
```

## 🎯 Funcionalidades por Módulo

### 👥 Gestión de Usuarios

- Registro de nuevos colaboradores
- Visualización de solicitudes de usuarios
- Estados de solicitud (Pendiente, Aprobado, Rechazado)
- Búsqueda y filtrado
- Paginación

### 🔐 Control de Accesos

- Gestión de permisos de sistema
- Solicitudes de acceso
- Historial de asignaciones
- Control por área y rol

### 💻 Gestión de Equipos

- Asignación de equipos de cómputo
- Inventario de equipos disponibles
- Historial de asignaciones
- Conflictos de equipos

### ✅ Sistema de Aprobaciones

- Flujo de aprobación centralizado
- Dashboard de estadísticas
- Gestión de conflictos
- Información detallada de solicitudes

## 🚦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción

# Linting
npm run lint         # Ejecuta ESLint para verificar el código

# Vista previa
npm run preview      # Vista previa de la construcción de producción
```

## 🔄 API Endpoints

La aplicación se conecta a los siguientes endpoints:

- `GET /lideres/:id/usuarios/solicitudes` - Obtener solicitudes de usuarios
- `POST /usuarios/solicitudes` - Crear solicitud de usuario
- `GET /lideres/:id/accesos/solicitudes` - Obtener solicitudes de accesos
- `POST /accesos/solicitudes` - Crear solicitud de acceso
- `GET /lideres/:id/equipos/solicitudes` - Obtener solicitudes de equipos
- `POST /equipos/solicitudes` - Crear solicitud de equipo
- `GET /lideres/:id/solicitudes` - Obtener todas las solicitudes

### Configuración de Rutas

Las rutas están definidas en `App.tsx` usando React Router:

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/usuarios" element={<Usuarios />} />
  <Route path="/accesos" element={<Accesos />} />
  <Route path="/computadores" element={<Computadores />} />
  <Route path="/aprobaciones" element={<Aprobaciones />} />
</Routes>
```

## 📝 Variables de Entorno

```env
VITE_API_URL=http://localhost:3001  # URL base del backend
```
