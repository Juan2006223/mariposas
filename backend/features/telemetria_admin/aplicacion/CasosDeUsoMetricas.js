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

  async ejecutar({ pagina = 1, limite = 20 } = {}) {
    const page = Math.max(1, Number(pagina) || 1);
    const pageSize = Math.min(20, Math.max(1, Number(limite) || 20));
    const paginados = this.perfilRepository.listarPagina
      ? await this.perfilRepository.listarPagina(page, pageSize)
      : { perfiles: (await this.perfilRepository.listarTodos()).slice((page - 1) * pageSize, page * pageSize), total: (await this.perfilRepository.listarTodos()).length };
    const perfiles = paginados.perfiles;
    const stats = this.metricasRepository.obtenerAgregadosDashboard
      ? await this.metricasRepository.obtenerAgregadosDashboard()
      : null;
    const conteos = this.progresoRepository.contarPorNinos
      ? await this.progresoRepository.contarPorNinos(perfiles)
      : {};
    const eventos = stats ? [] : await this.metricasRepository.listarEventos();
    const artefactos = stats ? [] : await this.progresoRepository.listarArtefactos();

    const totalNinos = stats ? stats.totalNinos : paginados.total;
    const ninosGrupoG1 = stats ? Number((stats.grupos.find(g => g.grupo_edad === '6-8') || {}).total || 0) : perfiles.filter(p => p.grupo_edad === '6-8' || p.grupoEdad === '6-8').length;
    const ninosGrupoG2 = stats ? Number((stats.grupos.find(g => g.grupo_edad === '9-12') || {}).total || 0) : perfiles.filter(p => p.grupo_edad === '9-12' || p.grupoEdad === '9-12').length;

    // Conteo por estación
    const estacionesVisitadas = {};
    for (let i = 1; i <= 6; i++) {
      estacionesVisitadas[`Estación ${i}`] = 0;
    }

    (stats ? stats.estaciones.map(row => ({ categoria: 'estacion', detalles: { estacion: row.estacion }, cantidad: row.total })) : eventos).forEach(ev => {
      if (ev.categoria === 'estacion' && ev.detalles && ev.detalles.estacion) {
        const estKey = `Estación ${ev.detalles.estacion}`;
        estacionesVisitadas[estKey] = (estacionesVisitadas[estKey] || 0) + Number(ev.cantidad || 1);
      }
    });

    const paginaPerfiles = perfiles.map(p => ({ ...p, ...(conteos[p.id] || { dibujos: 0, respuestas: 0 }) }));

    return {
      resumen: {
        totalNinos,
        ninosGrupoG1,
        ninosGrupoG2,
        totalEventos: stats ? stats.totalEventos : eventos.length,
        totalArtefactosMural: stats ? stats.totalCreaciones : artefactos.length,
      },
      estacionesVisitadas,
      ultimosPerfiles: paginaPerfiles,
      pagina: { actual: page, limite: pageSize, total: paginados.total, paginas: Math.ceil(paginados.total / pageSize) },
      graficas: stats ? { dias: stats.dias, creaciones: stats.creaciones } : { dias: [], creaciones: [] },
      ultimosEventos: eventos.slice(0, 100),
    };
  }
}

module.exports = {
  RegistrarMetricaUseCase,
  ObtenerDashboardMetricasUseCase,
};
