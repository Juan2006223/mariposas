const { EventoMetrica } = require('../dominio/EventoMetrica');

class RegistrarMetricaUseCase {
  constructor(metricasRepository) {
    this.metricasRepository = metricasRepository;
  }

  async ejecutar({ ninoId, tipoEvento, categoria, detalles, duracionSegundos }) {
    const metrica = new EventoMetrica({
      ninoId,
      tipoEvento,
      categoria,
      detalles,
      duracionSegundos,
    });
    return await this.metricasRepository.guardar(metrica);
  }
}

class ObtenerDashboardMetricasUseCase {
  constructor(metricasRepository, perfilRepository, progresoRepository) {
    this.metricasRepository = metricasRepository;
    this.perfilRepository = perfilRepository;
    this.progresoRepository = progresoRepository;
  }

  async ejecutar() {
    const perfiles = await this.perfilRepository.listarTodos();
    const eventos = await this.metricasRepository.listarEventos();
    const artefactos = await this.progresoRepository.listarArtefactos();

    const totalNinos = perfiles.length;
    const ninosGrupoG1 = perfiles.filter(p => p.grupo_edad === '6-8' || p.grupoEdad === '6-8').length;
    const ninosGrupoG2 = perfiles.filter(p => p.grupo_edad === '9-12' || p.grupoEdad === '9-12').length;

    // Conteo por estación
    const estacionesVisitadas = {};
    for (let i = 1; i <= 6; i++) {
      estacionesVisitadas[`Estación ${i}`] = 0;
    }

    eventos.forEach(ev => {
      if (ev.categoria === 'estacion' && ev.detalles && ev.detalles.estacion) {
        const estKey = `Estación ${ev.detalles.estacion}`;
        estacionesVisitadas[estKey] = (estacionesVisitadas[estKey] || 0) + 1;
      }
    });

    return {
      resumen: {
        totalNinos,
        ninosGrupoG1,
        ninosGrupoG2,
        totalEventos: eventos.length,
        totalArtefactosMural: artefactos.length,
      },
      estacionesVisitadas,
      ultimosPerfiles: perfiles.slice(0, 10),
      ultimosEventos: eventos.slice(0, 15),
    };
  }
}

module.exports = {
  RegistrarMetricaUseCase,
  ObtenerDashboardMetricasUseCase,
};
