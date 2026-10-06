const express = require('express');
const { isPostgresConnected } = require('../../../db/connection');
const { clientError, publicError, requireAdminToken } = require('../../../security');

function createTelemetriaRouter({ repos, useCases }) {
  const router = express.Router();
  const { perfilRepo, progresoRepo, metricasRepo } = repos;
  const { registrarMetricaUC, dashboardMetricasUC } = useCases;

  router.post('/metricas/evento', async (req, res) => {
    try {
      const metrica = await registrarMetricaUC.ejecutar(req.body);
      res.status(201).json({ success: true, data: metrica });
    } catch (err) {
      res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 400)
        .json({ success: false, error: clientError(err.message) });
    }
  });

  router.get('/admin/dashboard', requireAdminToken, async (req, res) => {
    try {
      const data = await dashboardMetricasUC.ejecutar({ pagina: req.query.pagina, limite: req.query.limite });
      return res.json({ success: true, postgresConectado: isPostgresConnected(), data });
    } catch (err) {
      return res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 500)
        .json({ success: false, error: publicError(err) });
    }
  });

  router.get('/admin/participantes/:id/espacio', requireAdminToken, async (req, res) => {
    try {
      if (!isPostgresConnected()) {
        return res.status(503).json({ success: false, error: 'Neon no está conectado. No se muestran datos temporales.' });
      }
      const perfil = await perfilRepo.buscarPorId(req.params.id);
      if (!perfil) return res.status(404).json({ success: false, error: 'Participante no encontrado.' });
      const [espacio, eventos] = await Promise.all([
        progresoRepo.obtenerEspacioNino(req.params.id, perfil.nombre),
        metricasRepo.listarPorNino(req.params.id),
      ]);
      return res.json({ success: true, data: { ...espacio, eventos } });
    } catch (err) {
      return res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 500)
        .json({ success: false, error: publicError(err) });
    }
  });

  return router;
}

module.exports = { createTelemetriaRouter };
