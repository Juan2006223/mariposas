class EventoMetrica {
  constructor({ id, ninoId, tipoEvento, categoria, detalles, duracionSegundos, timestamp }) {
    this.validarEvento(tipoEvento, categoria);

    this.id = id || `met_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this.ninoId = ninoId || null;
    this.tipoEvento = tipoEvento;
    this.categoria = categoria; // 'navegacion', 'estacion', 'mural', 'onboarding'
    this.detalles = detalles || {};
    this.duracionSegundos = parseInt(duracionSegundos) || 0;
    this.timestamp = timestamp || new Date().toISOString();
  }

  validarEvento(tipo, categoria) {
    if (!tipo || typeof tipo !== 'string') {
      throw new Error('El tipo de evento es obligatorio.');
    }
    if (!categoria || typeof categoria !== 'string') {
      throw new Error('La categoría del evento es obligatoria.');
    }
  }

  toJSON() {
    return {
      id: this.id,
      ninoId: this.ninoId,
      tipoEvento: this.tipoEvento,
      categoria: this.categoria,
      detalles: this.detalles,
      duracionSegundos: this.duracionSegundos,
      timestamp: this.timestamp,
    };
  }
}

module.exports = { EventoMetrica };
