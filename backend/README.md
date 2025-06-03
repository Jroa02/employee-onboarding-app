# 🚀 Employee Onboarding API

API REST para la gestión de colaboradores, permisos y equipos empresariales, desarrollada con Node.js, TypeScript, Express y PostgreSQL siguiendo arquitectura DDD (Domain Driven Design).

## ✨ Características Principales

- 🏗️ **Arquitectura DDD**: Separación clara entre dominio, aplicación, infraestructura e interfaces
- 🔍 **Validación OpenAPI**: Validación automática de requests/responses con express-openapi-validator
- 🗄️ **Base de datos**: PostgreSQL con driver nativo (pg)
- 📚 **Documentación**: Swagger UI automática integrada
- 💻 **TypeScript**: Tipado fuerte en todo el proyecto
- 🐳 **Docker**: Base de datos local con Docker Compose
- 🔐 **CORS habilitado**: Configurado para desarrollo y producción

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── domain/                    # 🏛️ Capa de Dominio
│   │   ├── entities/              # Entidades del negocio
│   │   │   ├── Equipment.ts       # Equipos/Computadores
│   │   │   ├── HistorialAsignacion.ts  # Historial de cambios
│   │   │   ├── RequestUsersByLeader.ts # Solicitudes de líderes
│   │   │   ├── SolicitudConflicto.ts   # Gestión de conflictos
│   │   │   ├── SolicitudUnificada.ts   # Solicitudes unificadas
│   │   │   └── User.ts            # Usuarios/Colaboradores
│   │   ├── repositories/          # Interfaces de repositorios
│   │   └── types/                 # Tipos de respuesta API
│   │
│   ├── application/               # 🎯 Capa de Aplicación
│   │   ├── controllers/           # Controladores HTTP
│   │   │   ├── EquipmentController.ts   # Control de equipos
│   │   │   ├── HistorialController.ts   # Control de historial
│   │   │   ├── LeaderController.ts      # Control de líderes
│   │   │   ├── PermissionController.ts  # Control de permisos
│   │   │   ├── SolicitudController.ts   # Control de solicitudes
│   │   │   ├── TIController.ts          # Control de TI
│   │   │   └── UserController.ts        # Control de usuarios
│   │   ├── services/              # Servicios de negocio
│   │   └── utils/                 # Utilidades
│   │
│   ├── infrastructure/            # 🔧 Capa de Infraestructura
│   │   ├── server.ts              # Configuración del servidor
│   │   ├── database/              # Configuración de BD
│   │   │   └── connection.ts      # Conexión PostgreSQL
│   │   └── repositories/          # Implementaciones de repositorios
│   │
│   └── interface/                 # 🌐 Capa de Interfaz
│       └── routes/                # Definición de rutas API
│
├── static/
│   └── OAS.yml                    # Especificación OpenAPI 3.0
├── db/
│   ├── docker-compose.yml         # Docker para PostgreSQL
│   └── scriptDB.sql               # Scripts de base de datos
├── create-lambda-package.bat      # Script para AWS Lambda
├── create-lambda-package.ps1      # Script PowerShell alternativo
└── index.js                       # Entry point (opcional)
```

## 🛠️ Instalación y Configuración

### 1. Prerrequisitos

- Node.js >= 20.x
- Docker y Docker Compose (para BD local)

### 2. Clonar e instalar

```bash
git clone <your-repository>
cd employee-onboarding-app/backend
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto backend:

```env
# Servidor
PORT=3001
NODE_ENV=development

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=developer
DB_PASSWORD=dev_password
DB_NAME=myapp_dev
```

### 4. Iniciar base de datos

```bash
# Iniciar PostgreSQL con Docker
cd db
docker-compose up -d

# Verificar que está corriendo
docker-compose ps

# Scripts de DB
/db/scriptDB.sql
```

### 5. Ejecutar la aplicación

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm start
```

## 🗄️ Base de Datos

### Desarrollo Local

- PostgreSQL corriendo en Docker
- Puerto: 5432
- Usuario: `developer`
- Password: `dev_password`
- Base de datos: `myapp_dev`

### Scripts disponibles

```bash
# Docker Compose
cd db
docker-compose up -d     # Iniciar
docker-compose down      # Detener
docker-compose logs -f   # Ver logs
```

## 🏗️ Arquitectura DDD

### Domain Layer (Dominio)

- **Entities**: Modelos de negocio puros sin dependencias externas
- **Repository Interfaces**: Contratos para acceso a datos
- **Types**: Definiciones de tipos del dominio

### Application Layer (Aplicación)

- **Controllers**: Manejo de HTTP requests/responses
- **Services**: Lógica de negocio y casos de uso
- **Utils**: Utilidades compartidas

### Infrastructure Layer (Infraestructura)

- **Database**: Configuración y conexión a PostgreSQL
- **Repositories**: Implementaciones concretas de repositorios
- **Server**: Configuración de Express y middleware

### Interface Layer (Interfaz)

- **Routes**: Definición de endpoints y validaciones
- **Middleware**: Validación OpenAPI, CORS, manejo de errores

### 🎉 ¡Gracias por usar Employee Onboarding API!

_Desarrollado con ❤️ usando Node.js, TypeScript y PostgreSQL_
