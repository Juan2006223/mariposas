const express = require('express');
const { clientError, publicError, requireAdminToken } = require('../../../security');

function createExperienciasRouter({ repos, useCases }) {
  const router = express.Router();
  const { progresoRepo } = repos;
  const { guardarProgresoUC, obtenerProgresoUC, guardarArtefactoUC, registrarMetricaUC } = useCases;

  router.post('/progreso', async (req, res) => {
    try {
      const progreso = await guardarProgresoUC.ejecutar(req.body);
      registrarMetricaUC.ejecutar({
        ninoId: req.body.ninoId,
        tipoEvento: 'AVANCE_ESTACION',
        categoria: 'estacion',
        detalles: { estacion: req.body.estacionNum, completado: req.body.completado },
      }).catch(err => console.warn('No se guardó evento de estación:', err.message));
      res.json({ success: true, data: progreso });
    } catch (err) {
      res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 400)
        .json({ success: false, error: clientError(err.message) });
    }
  });

  router.get('/progreso/:ninoId', async (req, res) => {
    try {
      const progreso = await obtenerProgresoUC.ejecutar(req.params.ninoId);
      res.json({ success: true, data: progreso });
    } catch (err) {
      res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 500)
        .json({ success: false, error: publicError(err) });
    }
  });

  router.post('/mural', async (req, res) => {
    try {
      const art = await guardarArtefactoUC.ejecutar(req.body);
      registrarMetricaUC.ejecutar({
        ninoId: req.body.ninoId,
        tipoEvento: 'CREACION_MURAL',
        categoria: 'mural',
        detalles: { tipo: req.body.tipo, autor: req.body.autor },
      }).catch(err => console.warn('No se guardó evento de mural:', err.message));
      res.status(201).json({ success: true, data: art });
    } catch (err) {
      res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 400)
        .json({ success: false, error: clientError(err.message) });
    }
  });

  router.get('/mural', async (req, res) => {
    try {
      const artefactos = await progresoRepo.listarArtefactos(req.query.tipo);
      res.json({ success: true, data: artefactos });
    } catch (err) {
      res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 500)
        .json({ success: false, error: publicError(err) });
    }
  });

  router.delete('/mural/:id', requireAdminToken, async (req, res) => {
    try {
      const deleted = await progresoRepo.borrarArtefacto(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Artefacto no encontrado.' });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: publicError(err) });
    }
  });

  return router;
}

module.exports = { createExperienciasRouter };
