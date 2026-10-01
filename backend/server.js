const express = require('express');
const cors = require('cors');
const path = require('path');
const { checkConnection, initSchema, isPostgresConnected } = require('./db/connection');
const {
  buildCorsOptions,
  clientError,
  publicError,
  requireAdminToken,
  securityHeaders,
} = require('./security');

const { PerfilPostgresRepository } = require('./features/onboarding_nino/infraestructura/PerfilPostgresRepo');
const { RegistrarPerfilNinoUseCase, ObtenerPerfilesUseCase } = require('./features/onboarding_nino/aplicacion/CasosDeUsoPerfil');

const { ProgresoPostgresRepository } = require('./features/estaciones_experiencia/infraestructura/ProgresoPostgresRepo');
const { GuardarProgresoUseCase, ObtenerProgresoNinoUseCase, GuardarArtefactoMuralUseCase } = require('./features/estaciones_experiencia/aplicacion/CasosDeUsoProgreso');

const { MetricasPostgresRepository } = require('./features/telemetria_admin/infraestructura/MetricasPostgresRepo');
const { RegistrarMetricaUseCase, ObtenerDashboardMetricasUseCase } = require('./features/telemetria_admin/aplicacion/CasosDeUsoMetricas');

const app = express();
app.disable('x-powered-by');
app.use(securityHeaders);
app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));

if (process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(path.join(__dirname, '../frontend')));
}

// Inyección de dependencias
const perfilRepo = new PerfilPostgresRepository();
const progresoRepo = new ProgresoPostgresRepository();
const metricasRepo = new MetricasPostgresRepository();

const registrarPerfilUC = new RegistrarPerfilNinoUseCase(perfilRepo);
const obtenerPerfilesUC = new ObtenerPerfilesUseCase(perfilRepo);
const guardarProgresoUC = new GuardarProgresoUseCase(progresoRepo);
const obtenerProgresoUC = new ObtenerProgresoNinoUseCase(progresoRepo);
const guardarArtefactoUC = new GuardarArtefactoMuralUseCase(progresoRepo);
const registrarMetricaUC = new RegistrarMetricaUseCase(metricasRepo);
const dashboardMetricasUC = new ObtenerDashboardMetricasUseCase(metricasRepo, perfilRepo, progresoRepo);

// --- Rutas de Onboarding de Niños ---
app.post('/api/perfiles', async (req, res) => {
  try {
    const perfil = await registrarPerfilUC.ejecutar(req.body);
    await registrarMetricaUC.ejecutar({
      ninoId: perfil.id,
      tipoEvento: 'REGISTRO_PERFIL',
      categoria: 'onboarding',
      detalles: { nombre: perfil.nombre, grupo: perfil.grupoEdad || perfil.grupo_edad },
    });
    res.status(201).json({ success: true, data: perfil });
  } catch (err) {
    res.status(400).json({ success: false, error: clientError(err.message) });
  }
});

app.get('/api/perfiles', async (req, res) => {
  try {
    const perfiles = await obtenerPerfilesUC.ejecutar();
    res.json({ success: true, data: perfiles });
  } catch (err) {
    res.status(500).json({ success: false, error: publicError(err) });
  }
});

// --- Rutas de Progreso y Estaciones ---
app.post('/api/progreso', async (req, res) => {
  try {
    const progreso = await guardarProgresoUC.ejecutar(req.body);
    await registrarMetricaUC.ejecutar({
      ninoId: req.body.ninoId,
      tipoEvento: 'AVANCE_ESTACION',
      categoria: 'estacion',
      detalles: { estacion: req.body.estacionNum, completado: req.body.completado },
    });
    res.json({ success: true, data: progreso });
  } catch (err) {
    res.status(400).json({ success: false, error: clientError(err.message) });
  }
});

app.get('/api/progreso/:ninoId', async (req, res) => {
  try {
    const progreso = await obtenerProgresoUC.ejecutar(req.params.ninoId);
    res.json({ success: true, data: progreso });
  } catch (err) {
    res.status(500).json({ success: false, error: publicError(err) });
  }
});

// --- Rutas de Mural Digital ---
app.post('/api/mural', async (req, res) => {
  try {
    const art = await guardarArtefactoUC.ejecutar(req.body);
    await registrarMetricaUC.ejecutar({
      ninoId: req.body.ninoId,
      tipoEvento: 'CREACION_MURAL',
      categoria: 'mural',
      detalles: { tipo: req.body.tipo, autor: req.body.autor },
    });
    res.status(201).json({ success: true, data: art });
  } catch (err) {
    res.status(400).json({ success: false, error: clientError(err.message) });
  }
});

app.get('/api/mural', async (req, res) => {
  try {
    const artefactos = await progresoRepo.listarArtefactos(req.query.tipo);
    res.json({ success: true, data: artefactos });
  } catch (err) {
    res.status(500).json({ success: false, error: publicError(err) });
  }
});

// --- Rutas de Telemetría y Dashboard Admin ---
app.post('/api/metricas/evento', async (req, res) => {
  try {
    const metrica = await registrarMetricaUC.ejecutar(req.body);
    res.status(201).json({ success: true, data: metrica });
  } catch (err) {
    res.status(400).json({ success: false, error: clientError(err.message) });
  }
});

app.get('/api/admin/dashboard', requireAdminToken, async (req, res) => {
  try {
    const metricas = await dashboardMetricasUC.ejecutar();
    res.json({
      success: true,
      postgresConectado: isPostgresConnected(),
      data: metricas,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: publicError(err) });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    postgres: isPostgresConnected() ? 'conectado' : 'modo_memoria_reserva',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  await checkConnection();
  await initSchema();
  return app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend iniciado en http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  iniciarServidor();
}

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: publicError(err),
  });
});

module.exports = { app, iniciarServidor };
