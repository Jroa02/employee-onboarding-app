-- =============================================
-- Sistema de Gestión de Colaboradores
-- VERSIÓN PARA RETO - Líderes y TI ya registrados
-- =============================================

-- Tabla de líderes (ya registrados, solo login)
CREATE TABLE lideres (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    area_responsable VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de personal TI (ya registrados, solo login)
CREATE TABLE personal_ti (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios/colaboradores (estructura completa)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    area VARCHAR(100) NOT NULL,
    rol VARCHAR(100) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP WITH TIME ZONE NULL,
    lider_solicitante_id INTEGER NOT NULL,
    aprobado_por_ti_id INTEGER NULL,
    observaciones_ti TEXT NULL,
    FOREIGN KEY (lider_solicitante_id) REFERENCES lideres(id) ON DELETE RESTRICT,
    FOREIGN KEY (aprobado_por_ti_id) REFERENCES personal_ti(id) ON DELETE SET NULL
);

-- Catálogo de permisos disponibles
CREATE TABLE permisos_disponibles (
    id SERIAL PRIMARY KEY,
    nombre_permiso VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Solicitudes de accesos/permisos (estructura completa)
CREATE TABLE solicitudes_accesos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    permiso_id INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    fecha_solicitud TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP WITH TIME ZONE NULL,
    observaciones_ti TEXT NULL,
    lider_solicitante_id INTEGER NOT NULL,
    procesado_por_ti_id INTEGER NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos_disponibles(id) ON DELETE RESTRICT,
    FOREIGN KEY (lider_solicitante_id) REFERENCES lideres(id) ON DELETE RESTRICT,
    FOREIGN KEY (procesado_por_ti_id) REFERENCES personal_ti(id) ON DELETE SET NULL,
    UNIQUE(usuario_id, permiso_id) -- Evita solicitudes duplicadas
);

-- Inventario de computadores
CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('laptop', 'desktop')),
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(100) UNIQUE NOT NULL,
    procesador VARCHAR(100) NOT NULL,
    ram VARCHAR(20) NOT NULL,
    almacenamiento VARCHAR(50) NOT NULL,
    sistema_operativo VARCHAR(50) NOT NULL CHECK (sistema_operativo IN ('Windows 11', 'Windows 10', 'macOS Ventura', 'macOS Monterey', 'Ubuntu 22.04', 'Ubuntu 20.04', 'Linux Mint', 'CentOS')),
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'asignado', 'mantenimiento')),
    fecha_adquisicion DATE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Solicitudes de equipos (estructura completa)
CREATE TABLE solicitudes_equipos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    equipo_id INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    fecha_solicitud TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP WITH TIME ZONE NULL,
    observaciones_ti TEXT NULL,
    lider_solicitante_id INTEGER NOT NULL,
    procesado_por_ti_id INTEGER NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE RESTRICT,
    FOREIGN KEY (lider_solicitante_id) REFERENCES lideres(id) ON DELETE RESTRICT,
    FOREIGN KEY (procesado_por_ti_id) REFERENCES personal_ti(id) ON DELETE SET NULL,
    UNIQUE(usuario_id, equipo_id) -- Evita solicitudes duplicadas del mismo equipo
);

-- Historial de asignaciones de equipos (con trazabilidad TI)
CREATE TABLE historial_asignaciones (
    id SERIAL PRIMARY KEY,
    equipo_id INTEGER NOT NULL,
    usuario_id INTEGER,
    usuario_nombre VARCHAR(100) NOT NULL,
    usuario_email VARCHAR(150) NOT NULL,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('asignado', 'devuelto', 'mantenimiento', 'baja')),
    fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion DATE,
    observaciones TEXT,
    ejecutado_por_ti_id INTEGER NOT NULL,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (ejecutado_por_ti_id) REFERENCES personal_ti(id) ON DELETE RESTRICT
);

-- =============================================
-- CONFIGURACIÓN DE ZONA HORARIA
-- =============================================

-- Configurar zona horaria para Colombia
SET timezone = 'America/Bogota';


-- =============================================
-- DATOS PRECARGADOS PARA EL RETO
-- =============================================

-- Insertar líderes de ejemplo (contraseña: "lider123")
INSERT INTO lideres (nombre, email, area_responsable, password_hash) VALUES
('Juan Pérez', 'juan.perez@empresa.com', 'Desarrollo', '$2a$10$HqI7qF2QOQ4vV8yqoZdwXO5k6J1QhI4YzC1mLYQXl8mF7dGr9s5Qa'),
('María González', 'maria.gonzalez@empresa.com', 'Frontend', '$2a$10$HqI7qF2QOQ4vV8yqoZdwXO5k6J1QhI4YzC1mLYQXl8mF7dGr9s5Qa'),
('Carlos López', 'carlos.lopez@empresa.com', 'Backend', '$2a$10$HqI7qF2QOQ4vV8yqoZdwXO5k6J1QhI4YzC1mLYQXl8mF7dGr9s5Qa'),
('Ana Rodríguez', 'ana.rodriguez@empresa.com', 'QA', '$2a$10$HqI7qF2QOQ4vV8yqoZdwXO5k6J1QhI4YzC1mLYQXl8mF7dGr9s5Qa');

-- Insertar personal TI de ejemplo (contraseña: "ti123")
INSERT INTO personal_ti (nombre, email, especialidad, password_hash) VALUES
('Admin TI', 'admin.ti@empresa.com', 'Administración General', '$2a$10$HqI7qF2QOQ4vV8yqoZdwXO5k6J1QhI4YzC1mLYQXl8mF7dGr9s5Qa'),
('Laura Sistemas', 'laura.sistemas@empresa.com', 'Infraestructura', '$2a$10$HqI7qF2QOQ4vV8yqoZdwXO5k6J1QhI4YzC1mLYQXl8mF7dGr9s5Qa'),
('Pedro Security', 'pedro.security@empresa.com', 'Seguridad', '$2a$10$HqI7qF2QOQ4vV8yqoZdwXO5k6J1QhI4YzC1mLYQXl8mF7dGr9s5Qa');

-- Insertar permisos disponibles
INSERT INTO permisos_disponibles (id, nombre_permiso, descripcion, categoria, activo, fecha_creacion) VALUES

-- =============================================
-- CATEGORÍA: DESARROLLO
-- =============================================
(1, 'GitHub Repository Access', 'Acceso de lectura y escritura a repositorios de código fuente', 'Desarrollo', true, '2025-06-01 08:00:00'),
(2, 'GitLab CI/CD Pipeline', 'Permisos para ejecutar y configurar pipelines de integración continua', 'Desarrollo', true, '2025-06-01 08:00:00'),
(3, 'Visual Studio Code Online', 'Acceso al entorno de desarrollo integrado en la nube', 'Desarrollo', true, '2025-06-01 08:00:00'),
(4, 'Docker Registry Push/Pull', 'Permisos para subir y descargar imágenes de contenedores', 'Desarrollo', true, '2025-06-01 08:00:00'),
(5, 'SonarQube Code Quality', 'Acceso a herramientas de análisis de calidad de código', 'Desarrollo', true, '2025-06-01 08:00:00'),
(6, 'NPM Package Registry', 'Permisos para publicar y descargar paquetes NPM privados', 'Desarrollo', true, '2025-06-01 08:00:00'),
(7, 'API Development Tools', 'Acceso a Postman, Swagger y herramientas de documentación de APIs', 'Desarrollo', true, '2025-06-01 08:00:00'),
(8, 'Database Development Access', 'Permisos de lectura/escritura en bases de datos de desarrollo', 'Desarrollo', true, '2025-06-01 08:00:00'),
(9, 'Code Review Platform', 'Acceso a herramientas de revisión de código y pull requests', 'Desarrollo', true, '2025-06-01 08:00:00'),
(10, 'Local Development Environment', 'Permisos para configurar entornos de desarrollo local', 'Desarrollo', true, '2025-06-01 08:00:00'),

-- =============================================
-- CATEGORÍA: INFRASTRUCTURA
-- =============================================
(11, 'AWS Console Access', 'Acceso a la consola de Amazon Web Services con permisos específicos', 'Infrastructura', true, '2025-06-01 08:00:00'),
(12, 'Azure Portal Access', 'Permisos para gestionar recursos en Microsoft Azure', 'Infrastructura', true, '2025-06-01 08:00:00'),
(13, 'Kubernetes Cluster Admin', 'Acceso administrativo a clusters de Kubernetes', 'Infrastructura', true, '2025-06-01 08:00:00'),
(14, 'Terraform Cloud Access', 'Permisos para gestionar infraestructura como código', 'Infrastructura', true, '2025-06-01 08:00:00'),
(15, 'Server SSH Access', 'Acceso SSH a servidores de producción y staging', 'Infrastructura', true, '2025-06-01 08:00:00'),
(16, 'Monitoring Tools Access', 'Acceso a Grafana, Prometheus y herramientas de monitoreo', 'Infrastructura', true, '2025-06-01 08:00:00'),
(17, 'Load Balancer Configuration', 'Permisos para configurar balanceadores de carga', 'Infrastructura', true, '2025-06-01 08:00:00'),
(18, 'DNS Management', 'Acceso para gestionar registros DNS y dominios', 'Infrastructura', true, '2025-06-01 08:00:00'),
(19, 'Backup and Recovery Access', 'Permisos para gestionar copias de seguridad y recuperación', 'Infrastructura', true, '2025-06-01 08:00:00'),
(20, 'Network Security Configuration', 'Acceso para configurar firewalls y políticas de red', 'Infrastructura', true, '2025-06-01 08:00:00'),
(21, 'CDN Management', 'Permisos para gestionar redes de distribución de contenido', 'Infrastructura', true, '2025-06-01 08:00:00'),
(22, 'Container Orchestration', 'Acceso a Docker Swarm y herramientas de orquestación', 'Infrastructura', true, '2025-06-01 08:00:00'),

-- =============================================
-- CATEGORÍA: PRUEBAS
-- =============================================
(23, 'Test Environment Access', 'Acceso a entornos de pruebas y staging', 'Pruebas', true, '2025-06-01 08:00:00'),
(24, 'Selenium Grid Access', 'Permisos para ejecutar pruebas automatizadas con Selenium', 'Pruebas', true, '2025-06-01 08:00:00'),
(25, 'Performance Testing Tools', 'Acceso a JMeter, LoadRunner y herramientas de carga', 'Pruebas', true, '2025-06-01 08:00:00'),
(26, 'Security Testing Platform', 'Permisos para herramientas de pruebas de seguridad (OWASP ZAP)', 'Pruebas', true, '2025-06-01 08:00:00'),
(27, 'Test Data Management', 'Acceso para crear y gestionar datos de prueba', 'Pruebas', true, '2025-06-01 08:00:00'),
(28, 'Bug Tracking System', 'Permisos en Jira para reportar y gestionar bugs', 'Pruebas', true, '2025-06-01 08:00:00'),
(29, 'Mobile Testing Platform', 'Acceso a dispositivos móviles para pruebas (BrowserStack)', 'Pruebas', true, '2025-06-01 08:00:00'),
(30, 'API Testing Tools', 'Permisos para Newman, Insomnia y herramientas de testing de APIs', 'Pruebas', true, '2025-06-01 08:00:00'),
(31, 'Database Testing Access', 'Permisos de lectura en bases de datos para validación de datos', 'Pruebas', true, '2025-06-01 08:00:00'),
(32, 'Cross-browser Testing', 'Acceso a herramientas de pruebas multi-navegador', 'Pruebas', true, '2025-06-01 08:00:00'),
(33, 'Test Automation Framework', 'Permisos para configurar frameworks de automatización', 'Pruebas', true, '2025-06-01 08:00:00'),

-- =============================================
-- CATEGORÍA: AGILE
-- =============================================
(34, 'Jira Project Admin', 'Permisos administrativos en proyectos de Jira', 'Agile', true, '2025-06-01 08:00:00'),
(35, 'Confluence Space Admin', 'Acceso administrativo a espacios de documentación', 'Agile', true, '2025-06-01 08:00:00'),
(36, 'Scrum Master Tools', 'Acceso a herramientas específicas para Scrum Masters', 'Agile', true, '2025-06-01 08:00:00'),
(37, 'Product Owner Dashboard', 'Dashboard y herramientas para Product Owners', 'Agile', true, '2025-06-01 08:00:00'),
(38, 'Sprint Planning Tools', 'Acceso a herramientas de planificación de sprints', 'Agile', true, '2025-06-01 08:00:00'),
(39, 'Retrospective Platform', 'Permisos para herramientas de retrospectivas (Miro, FunRetrospectives)', 'Agile', true, '2025-06-01 08:00:00'),
(40, 'Kanban Board Management', 'Acceso para gestionar tableros Kanban', 'Agile', true, '2025-06-01 08:00:00'),
(41, 'User Story Management', 'Permisos para crear y gestionar historias de usuario', 'Agile', true, '2025-06-01 08:00:00'),
(42, 'Agile Metrics Dashboard', 'Acceso a métricas de velocidad, burndown y KPIs ágiles', 'Agile', true, '2025-06-01 08:00:00'),
(43, 'Team Collaboration Tools', 'Permisos para Slack, Teams y herramientas de comunicación', 'Agile', true, '2025-06-01 08:00:00'),
(44, 'Release Management', 'Acceso para gestionar releases y deployment planning', 'Agile', true, '2025-06-01 08:00:00'),
(45, 'Stakeholder Reporting', 'Permisos para generar reportes para stakeholders', 'Agile', true, '2025-06-01 08:00:00');

-- Insertar computadores de ejemplo
INSERT INTO equipos (tipo, marca, modelo, numero_serie, procesador, ram, almacenamiento, sistema_operativo) VALUES
('laptop', 'Dell', 'Latitude 5520', 'DL001', 'Intel Core i7-1165G7', '16GB DDR4', '512GB SSD', 'Windows 11'),
('laptop', 'HP', 'EliteBook 850', 'HP001', 'Intel Core i7-1185G7', '32GB DDR4', '1TB SSD', 'Windows 10'),
('desktop', 'Dell', 'OptiPlex 7090', 'DL002', 'Intel Core i9-11900', '32GB DDR4', '1TB SSD', 'Windows 11'),
('laptop', 'Apple', 'MacBook Pro 14"', 'MB001', 'Apple M2 Pro', '16GB', '512GB SSD', 'macOS Ventura'),
('laptop', 'Apple', 'MacBook Air M1', 'MB002', 'Apple M1', '8GB', '256GB SSD', 'macOS Monterey'),
('desktop', 'HP', 'ProDesk 600', 'HP002', 'Intel Core i5-11500', '16GB DDR4', '256GB SSD + 1TB HDD', 'Windows 11'),
('laptop', 'Lenovo', 'ThinkPad X1 Carbon', 'LN001', 'Intel Core i7-1260P', '16GB LPDDR5', '512GB SSD', 'Ubuntu 22.04'),
('desktop', 'Custom Build', 'Workstation Dev', 'CB001', 'AMD Ryzen 9 5900X', '64GB DDR4', '2TB NVMe SSD', 'Ubuntu 20.04'),
('laptop', 'System76', 'Galago Pro', 'S76001', 'Intel Core i7-1165G7', '32GB DDR4', '1TB NVMe SSD', 'Linux Mint'),
('desktop', 'Dell', 'Precision 7000', 'DL003', 'Intel Xeon W-2295', '128GB ECC', '4TB NVMe SSD', 'CentOS');


-- =============================================
-- VISTAS
-- =============================================

CREATE OR REPLACE VIEW vista_solicitudes_usuarios AS
SELECT 
    -- Información del líder
    l.id as lider_id,
	
    -- Información de la solicitud de usuario
    'usuarios' as tabla_origen,
    u.id as solicitud_id,
    u.nombre as nombre_solicitado,
    u.email as email_solicitado,
    u.area as area_solicitada,
    u.rol as rol_solicitado,
    
    -- Estados y fechas
    u.estado,
    u.fecha_creacion as fecha_solicitud,
    u.fecha_respuesta,
    
    -- Procesamiento TI
    ti.nombre as procesado_por,
    ti.especialidad as especialidad_ti,
    u.observaciones_ti
    
FROM usuarios u
JOIN lideres l ON u.lider_solicitante_id = l.id
LEFT JOIN personal_ti ti ON u.aprobado_por_ti_id = ti.id
ORDER BY fecha_solicitud DESC;


--------------- 

-- 2. VISTA: Solo solicitudes de accesos
CREATE OR REPLACE VIEW vista_solicitudes_accesos AS
SELECT 
    -- Información del líder
    l.id as lider_id,
	
    -- Información de la solicitud de acceso
    'accesos' as tabla_origen,
    sa.id as solicitud_id,
    
    -- Información del usuario beneficiario
    u.id as usuario_id,
    u.nombre as usuario_nombre,
    u.email as usuario_email,
    u.area as usuario_area,
    u.rol as usuario_rol,
    
    -- Información del permiso
    p.id as permiso_id,
    p.nombre_permiso,
    p.descripcion as permiso_descripcion,
    p.categoria as permiso_categoria,
    
    -- Estados y fechas
    sa.estado,
    sa.fecha_solicitud,
    sa.fecha_respuesta,
    
    -- Procesamiento TI
    ti.nombre as procesado_por,
    ti.especialidad as especialidad_ti,
    sa.observaciones_ti
	
FROM solicitudes_accesos sa
JOIN lideres l ON sa.lider_solicitante_id = l.id
JOIN usuarios u ON sa.usuario_id = u.id AND u.estado = 'aprobado'
JOIN permisos_disponibles p ON sa.permiso_id = p.id
LEFT JOIN personal_ti ti ON sa.procesado_por_ti_id = ti.id
ORDER BY sa.fecha_solicitud DESC;

-- 3. VISTA: Solo solicitudes de equipos
CREATE OR REPLACE VIEW vista_solicitudes_equipos AS
SELECT 
    -- Información del líder
    l.id as lider_id,
    
    -- Información de la solicitud de equipo
    'equipos' as tabla_origen,
    se.id as solicitud_id,
    
    -- Información del usuario beneficiario
    u.id as usuario_id,
    u.nombre as usuario_nombre,
    u.email as usuario_email,
    u.area as usuario_area,
    u.rol as usuario_rol,
    
    -- Información del equipo
    e.id as equipo_id,
    e.tipo as equipo_tipo,
    e.marca as equipo_marca,
    e.modelo as equipo_modelo,
    e.numero_serie,
    e.procesador,
    e.ram,
    e.almacenamiento,
    e.sistema_operativo,
    e.estado as estado_equipo,
    
    -- Estados y fechas de la solicitud
    se.estado,
    se.fecha_solicitud,
    se.fecha_respuesta,
    
    -- Procesamiento TI
    ti.nombre as procesado_por,
    ti.especialidad as especialidad_ti,
    se.observaciones_ti

FROM solicitudes_equipos se
JOIN lideres l ON se.lider_solicitante_id = l.id
JOIN usuarios u ON se.usuario_id = u.id AND u.estado = 'aprobado'
JOIN equipos e ON se.equipo_id = e.id
LEFT JOIN personal_ti ti ON se.procesado_por_ti_id = ti.id
ORDER BY se.fecha_solicitud DESC;

-- =============================================
-- VISTA UNIFICADA: TODAS LAS SOLICITUDES
-- Usuarios + Accesos + Equipos
-- =============================================
CREATE OR REPLACE VIEW vista_todas_solicitudes AS

-- =============================================
-- SOLICITUDES DE USUARIOS
-- =============================================
SELECT 
    -- Identificación del líder
    l.id as lider_id,
    l.nombre as lider_nombre,
    l.area_responsable as lider_area,
    
    -- Tipo de solicitud
    'usuarios' as tipo_solicitud,
    u.id as solicitud_id,
    
    -- Información del beneficiario (mismo usuario en este caso)
    u.id as beneficiario_id,
    u.nombre as beneficiario_nombre,
    u.email as beneficiario_email,
    u.area as beneficiario_area,
    u.rol as beneficiario_rol,
         
    -- Estados y fechas
    u.estado,
    u.fecha_creacion as fecha_solicitud,
    u.fecha_respuesta,
    
    -- Personal TI que procesó
    ti.id as procesado_por_ti_id,
    ti.nombre as procesado_por_ti,
    ti.especialidad as especialidad_ti,
    u.observaciones_ti

FROM usuarios u
JOIN lideres l ON u.lider_solicitante_id = l.id
LEFT JOIN personal_ti ti ON u.aprobado_por_ti_id = ti.id

UNION ALL

-- =============================================
-- SOLICITUDES DE ACCESOS/PERMISOS
-- =============================================
SELECT 
    -- Identificación del líder
    l.id as lider_id,
    l.nombre as lider_nombre,
    l.area_responsable as lider_area,
    
    -- Tipo de solicitud
    'accesos' as tipo_solicitud,
    sa.id as solicitud_id,
    
    -- Información del beneficiario
    u.id as beneficiario_id,
    u.nombre as beneficiario_nombre,
    u.email as beneficiario_email,
    u.area as beneficiario_area,
    u.rol as beneficiario_rol,
    
    -- Estados y fechas
    sa.estado,
    sa.fecha_solicitud,
    sa.fecha_respuesta,
    
    -- Personal TI que procesó
    ti.id as procesado_por_ti_id,
    ti.nombre as procesado_por_ti,
    ti.especialidad as especialidad_ti,
    sa.observaciones_ti

FROM solicitudes_accesos sa
JOIN lideres l ON sa.lider_solicitante_id = l.id
JOIN usuarios u ON sa.usuario_id = u.id AND u.estado = 'aprobado'
JOIN permisos_disponibles p ON sa.permiso_id = p.id
LEFT JOIN personal_ti ti ON sa.procesado_por_ti_id = ti.id

UNION ALL

-- =============================================
-- SOLICITUDES DE EQUIPOS
-- =============================================
SELECT 
    -- Identificación del líder
    l.id as lider_id,
    l.nombre as lider_nombre,
    l.area_responsable as lider_area,
    
    -- Tipo de solicitud
    'equipos' as tipo_solicitud,
    se.id as solicitud_id,
    
    -- Información del beneficiario
    u.id as beneficiario_id,
    u.nombre as beneficiario_nombre,
    u.email as beneficiario_email,
    u.area as beneficiario_area,
    u.rol as beneficiario_rol,
        
    -- Estados y fechas
    se.estado,
    se.fecha_solicitud,
    se.fecha_respuesta,
    
    -- Personal TI que procesó
    ti.id as procesado_por_ti_id,
    ti.nombre as procesado_por_ti,
    ti.especialidad as especialidad_ti,
    se.observaciones_ti

FROM solicitudes_equipos se
JOIN lideres l ON se.lider_solicitante_id = l.id
JOIN usuarios u ON se.usuario_id = u.id AND u.estado = 'aprobado'
JOIN equipos e ON se.equipo_id = e.id
LEFT JOIN personal_ti ti ON se.procesado_por_ti_id = ti.id

-- Ordenar por fecha de solicitud (más recientes primero)
ORDER BY fecha_solicitud DESC;



CREATE OR REPLACE FUNCTION manejar_conflictos_equipos()
RETURNS TRIGGER AS $$
DECLARE
    v_usuario_nombre TEXT;
    v_solicitudes_rechazadas INTEGER := 0;
BEGIN
    -- Solo actuar cuando se APRUEBA una solicitud (cambio de estado a 'aprobado')
    IF NEW.estado = 'aprobado' AND (OLD.estado IS NULL OR OLD.estado != 'aprobado') THEN
        
        -- Obtener nombre del usuario aprobado para el mensaje
        SELECT u.nombre INTO v_usuario_nombre
        FROM usuarios u
        WHERE u.id = NEW.usuario_id;
        
        -- Rechazar automáticamente otras solicitudes pendientes del mismo equipo
        UPDATE solicitudes_equipos 
        SET 
            estado = 'rechazado',
            fecha_respuesta = NEW.fecha_respuesta,
            observaciones_ti = 'Equipo asignado a ' || v_usuario_nombre || '. Solicite otro equipo disponible.'
        WHERE equipo_id = NEW.equipo_id 
          AND id != NEW.id 
          AND estado = 'pendiente';
        
        -- Contar cuántas solicitudes se rechazaron
        GET DIAGNOSTICS v_solicitudes_rechazadas = ROW_COUNT;
        
        -- Cambiar estado del equipo a 'asignado'
        UPDATE equipos 
        SET estado = 'asignado'
        WHERE id = NEW.equipo_id;
        
        -- Crear registro en historial de asignaciones
        INSERT INTO historial_asignaciones (
            equipo_id, 
            usuario_id, 
            usuario_nombre, 
            usuario_email, 
            accion, 
            fecha_accion,
            ejecutado_por_ti_id,
            observaciones
        ) 
        SELECT 
            NEW.equipo_id,
            NEW.usuario_id,
            u.nombre,
            u.email,
            'asignado',
            NEW.fecha_respuesta,
            NEW.procesado_por_ti_id,
            'Equipo asignado mediante solicitud #' || NEW.id || 
            CASE WHEN v_solicitudes_rechazadas > 0 
                 THEN '. ' || v_solicitudes_rechazadas || ' solicitudes conflictivas rechazadas automáticamente.'
                 ELSE ''
            END
        FROM usuarios u
        WHERE u.id = NEW.usuario_id;
        
    -- Si se RECHAZA una solicitud, no hacer nada especial (el equipo sigue disponible)
    ELSIF NEW.estado = 'rechazado' AND (OLD.estado IS NULL OR OLD.estado != 'rechazado') THEN
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear el trigger
DROP TRIGGER IF EXISTS trigger_manejar_conflictos_equipos ON solicitudes_equipos;

CREATE TRIGGER trigger_manejar_conflictos_equipos
    AFTER UPDATE ON solicitudes_equipos
    FOR EACH ROW
    EXECUTE FUNCTION manejar_conflictos_equipos();
	
	
-- Función para verificar conflictos ANTES de aprobar (para mostrar en UI)
CREATE OR REPLACE FUNCTION verificar_conflictos_equipo(p_solicitud_id INTEGER)
RETURNS JSON AS $$
DECLARE
    v_equipo_id INTEGER;
    v_conflictos JSON;
    v_total_conflictos INTEGER;
BEGIN
    -- Obtener equipo de la solicitud
    SELECT equipo_id INTO v_equipo_id
    FROM solicitudes_equipos
    WHERE id = p_solicitud_id;
    
    IF v_equipo_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Solicitud no encontrada'
        );
    END IF;
    
    -- Buscar otras solicitudes pendientes del mismo equipo
    SELECT 
        json_agg(
            json_build_object(
                'solicitud_id', se.id,
                'usuario_nombre', u.nombre,
                'usuario_email', u.email,
                'fecha_solicitud', se.fecha_solicitud
            ) ORDER BY se.fecha_solicitud
        ),
        COUNT(*)
    INTO v_conflictos, v_total_conflictos
    FROM solicitudes_equipos se
    JOIN usuarios u ON se.usuario_id = u.id
    WHERE se.equipo_id = v_equipo_id 
      AND se.id != p_solicitud_id 
      AND se.estado = 'pendiente';
    
    RETURN json_build_object(
        'success', true,
        'equipo_id', v_equipo_id,
        'total_conflictos', COALESCE(v_total_conflictos, 0),
        'solicitudes_conflictivas', COALESCE(v_conflictos, '[]'::json),
        'mensaje', CASE 
            WHEN COALESCE(v_total_conflictos, 0) = 0 THEN 'No hay conflictos'
            WHEN v_total_conflictos = 1 THEN '1 solicitud será rechazada automáticamente'
            ELSE v_total_conflictos || ' solicitudes serán rechazadas automáticamente'
        END
    );
END;
$$ LANGUAGE plpgsql;
