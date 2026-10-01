class ProgresoEstacion {
  constructor({ id, ninoId, estacionNum, nombreEstacion, datosActividad, completado, actualizadoEn }) {
    this.validarEstacion(estacionNum);

    this.id = id || `prog_${ninoId || 'anon'}_${estacionNum}`;
    this.ninoId = ninoId || null;
    this.estacionNum = parseInt(estacionNum);
    this.nombreEstacion = nombreEstacion || `Estación ${estacionNum}`;
    this.datosActividad = datosActividad || {};
    this.completado = Boolean(completado);
    this.actualizadoEn = actualizadoEn || new Date().toISOString();
  }

  validarEstacion(num) {
    const val = parseInt(num);
    if (isNaN(val) || val < 1 || val > 6) {
      throw new Error('El número de estación debe estar entre 1 y 6.');
    }
  }

  marcarCompletada(datos = {}) {
    this.completado = true;
    this.datosActividad = { ...this.datosActividad, ...datos };
    this.actualizadoEn = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      ninoId: this.ninoId,
      estacionNum: this.estacionNum,
      nombreEstacion: this.nombreEstacion,
      datosActividad: this.datosActividad,
      completado: this.completado,
      actualizadoEn: this.actualizadoEn,
    };
  }
}

module.exports = { ProgresoEstacion };
