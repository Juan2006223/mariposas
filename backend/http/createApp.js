const express = require('express');
const cors = require('cors');
const path = require('path');
const { buildAppDependencies } = require('../composition/appDependencies');
const { isPostgresConnected } = require('../db/connection');
const { buildCorsOptions, publicError, securityHeaders } = require('../security');
const { createOnboardingRouter } = require('../features/onboarding_nino/infraestructura/httpRoutes');
const { createExperienciasRouter } = require('../features/estaciones_experiencia/infraestructura/httpRoutes');
const { createTelemetriaRouter } = require('../features/telemetria_admin/infraestructura/httpRoutes');

function createApp(dependencies = buildAppDependencies()) {
  const app = express();
  app.disable('x-powered-by');
  app.use(securityHeaders);
  app.use(cors(buildCorsOptions()));
  app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '10mb' }));

  if (process.env.SERVE_FRONTEND === 'true') {
    app.use(express.static(path.join(__dirname, '../../frontend')));
  }

  app.use('/api', createOnboardingRouter(dependencies));
  app.use('/api', createExperienciasRouter(dependencies));
  app.use('/api', createTelemetriaRouter(dependencies));
  app.get('/api/health', (req, res) => {
    const assetStorage = dependencies.services && dependencies.services.assetStorage;
    res.json({
      status: 'online',
      postgres: isPostgresConnected() ? 'conectado' : 'modo_memoria_reserva',
      cloudinary: assetStorage && assetStorage.estaConfigurado() ? 'configurado' : 'no_configurado',
      timestamp: new Date().toISOString(),
    });
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(err.status || err.statusCode || 500).json({ success: false, error: publicError(err) });
  });

  return app;
}

module.exports = { createApp };
