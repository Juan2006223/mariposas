-- Script de inicialización para PostgreSQL
-- Plataforma: Alas de Mariposa Viva

CREATE TABLE IF NOT EXISTS perfiles_ninos (
    id VARCHAR(64) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    avatar VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    fecha_nacimiento DATE,
    grupo_edad VARCHAR(10) NOT NULL, -- '6-8' o '9-12'
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progreso_estaciones (
    id VARCHAR(64) PRIMARY KEY,
    nino_id VARCHAR(64) REFERENCES perfiles_ninos(id) ON DELETE CASCADE,
    estacion_num INT NOT NULL,
    nombre_estacion VARCHAR(50) NOT NULL,
    datos_actividad JSONB,
    completado BOOLEAN DEFAULT FALSE,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mural_artefactos (
    id VARCHAR(64) PRIMARY KEY,
    nino_id VARCHAR(64) REFERENCES perfiles_ninos(id) ON DELETE SET NULL,
    tipo VARCHAR(20) NOT NULL, -- 'mariposa', 'voz', 'huella', 'reflexion'
    autor VARCHAR(100) NOT NULL,
    contenido JSONB NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metricas_eventos (
    id VARCHAR(64) PRIMARY KEY,
    nino_id VARCHAR(64) REFERENCES perfiles_ninos(id) ON DELETE SET NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    detalles JSONB,
    duracion_segundos INT DEFAULT 0,
    timestamp_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices de consulta frecuente para el Dashboard
CREATE INDEX IF NOT EXISTS idx_metricas_tipo ON metricas_eventos(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_progreso_nino ON progreso_estaciones(nino_id);
CREATE INDEX IF NOT EXISTS idx_mural_tipo ON mural_artefactos(tipo);
