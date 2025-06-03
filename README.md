# 🏢 Employee Onboarding System

Un sistema completo para la gestión del proceso de onboarding de nuevos colaboradores, construido con una arquitectura moderna de frontend y backend separados.

## 🏗️ Arquitectura del Sistema

Este proyecto está dividido en dos aplicaciones principales:

- **Backend**: API REST desarrollada con Node.js, TypeScript, Express y PostgreSQL
- **Frontend**: Aplicación web construida con React 19, TypeScript y Tailwind CSS

```
employee-onboarding-app/
├── backend/           # API REST (Puerto 3001)
│   ├── src/
│   ├── db/
│   └── static/
└── frontend/          # Aplicación React (Puerto 5173)
    ├── src/
```

## 📚 Documentación Detallada

### 🔧 [Backend - API REST](./backend/README.md)

- **Tecnologías**: Node.js, TypeScript, Express, PostgreSQL
- **Arquitectura**: Domain Driven Design (DDD)
- **Puerto**: 3001
- **Características**:
  - Gestión de usuarios y colaboradores
  - Control de equipos y asignaciones
  - Sistema de permisos y roles
  - Documentación OpenAPI/Swagger
  - Base de datos PostgreSQL con Docker

### 🎨 [Frontend - Aplicación Web](./frontend/README.md)

- **Tecnologías**: React 19, TypeScript, Vite, Tailwind CSS
- **Puerto**: 5173
- **Características**:
  - Interfaz moderna y responsive
  - Gestión de usuarios y onboarding
  - Control de accesos y permisos
  - Sistema de aprobaciones
  - Asignación de equipos

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+
- Docker y Docker Compose
- PostgreSQL (opcional, se puede usar Docker)

### 1. Configurar Backend

```bash
cd backend
npm install
docker-compose up -d  # Levantar PostgreSQL
npm run dev
```

### 2. Configurar Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🔄 Flujo de Desarrollo

1. **Backend** (Puerto 3001):

   - API REST con endpoints para todos los recursos
   - Validación automática con OpenAPI
   - Base de datos PostgreSQL

2. **Frontend** (Puerto 5173):
   - Interfaz de usuario para consumir la API
   - Gestión de estado local
   - Navegación con React Router

---

**Desarrollado para mejorar el proceso de onboarding de nuevos colaboradores**
