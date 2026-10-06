const express = require('express');
const { clientError, publicError, requireAdminToken } = require('../../../security');

function createOnboardingRouter({ useCases }) {
  const router = express.Router();
  const { registrarPerfilUC, obtenerPerfilesUC, borrarPerfilUC, registrarMetricaUC } = useCases;

  router.post('/perfiles', async (req, res) => {
    try {
      const perfil = await registrarPerfilUC.ejecutar(req.body);
      registrarMetricaUC.ejecutar({
        ninoId: perfil.id,
        tipoEvento: 'REGISTRO_PERFIL',
        categoria: 'onboarding',
        detalles: { nombre: perfil.nombre, grupo: perfil.grupoEdad || perfil.grupo_edad },
      }).catch(err => console.warn('No se guardó evento de onboarding:', err.message));
      res.status(201).json({ success: true, data: perfil });
    } catch (err) {
      res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 400)
        .json({ success: false, error: clientError(err.message) });
    }
  });

  router.get('/perfiles', async (req, res) => {
    try {
      const perfiles = await obtenerPerfilesUC.ejecutar();
      res.json({ success: true, data: perfiles });
    } catch (err) {
      res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 500)
        .json({ success: false, error: publicError(err) });
    }
  });

  router.delete('/perfiles/:id', requireAdminToken, async (req, res) => {
    try {
      const deleted = await borrarPerfilUC.ejecutar(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Perfil no encontrado.' });
      return res.json({ success: true });
    } catch (err) {
      return res.status(err.code === 'DATABASE_UNAVAILABLE' ? 503 : 500)
        .json({ success: false, error: publicError(err) });
    }
  });

  return router;
}

module.exports = { createOnboardingRouter };
