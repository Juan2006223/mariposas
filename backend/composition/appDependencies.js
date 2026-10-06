const { PerfilPostgresRepository } = require('../features/onboarding_nino/infraestructura/PerfilPostgresRepo');
const {
  BorrarPerfilNinoUseCase,
  ObtenerPerfilesUseCase,
  RegistrarPerfilNinoUseCase,
} = require('../features/onboarding_nino/aplicacion/CasosDeUsoPerfil');
const { ProgresoPostgresRepository } = require('../features/estaciones_experiencia/infraestructura/ProgresoPostgresRepo');
const { CloudinaryAssetStorage } = require('../features/estaciones_experiencia/infraestructura/CloudinaryAssetStorage');
const {
  GuardarArtefactoMuralUseCase,
  GuardarProgresoUseCase,
  ObtenerProgresoNinoUseCase,
} = require('../features/estaciones_experiencia/aplicacion/CasosDeUsoProgreso');
const { MetricasPostgresRepository } = require('../features/telemetria_admin/infraestructura/MetricasPostgresRepo');
const {
  ObtenerDashboardMetricasUseCase,
  RegistrarMetricaUseCase,
} = require('../features/telemetria_admin/aplicacion/CasosDeUsoMetricas');

function buildAppDependencies() {
  const perfilRepo = new PerfilPostgresRepository();
  const progresoRepo = new ProgresoPostgresRepository();
  const metricasRepo = new MetricasPostgresRepository();
  const assetStorage = new CloudinaryAssetStorage();

  return {
    repos: { perfilRepo, progresoRepo, metricasRepo },
    services: { assetStorage },
    useCases: {
      registrarPerfilUC: new RegistrarPerfilNinoUseCase(perfilRepo),
      obtenerPerfilesUC: new ObtenerPerfilesUseCase(perfilRepo),
      borrarPerfilUC: new BorrarPerfilNinoUseCase(perfilRepo, progresoRepo, metricasRepo),
      guardarProgresoUC: new GuardarProgresoUseCase(progresoRepo),
      obtenerProgresoUC: new ObtenerProgresoNinoUseCase(progresoRepo),
      guardarArtefactoUC: new GuardarArtefactoMuralUseCase(progresoRepo, assetStorage),
      registrarMetricaUC: new RegistrarMetricaUseCase(metricasRepo),
      dashboardMetricasUC: new ObtenerDashboardMetricasUseCase(metricasRepo, perfilRepo, progresoRepo),
    },
  };
}

module.exports = { buildAppDependencies };
