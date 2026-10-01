const { ProgresoEstacion } = require('../dominio/ProgresoEstacion');

class GuardarProgresoUseCase {
  constructor(progresoRepository) {
    this.progresoRepository = progresoRepository;
  }

  async ejecutar({ ninoId, estacionNum, nombreEstacion, datosActividad, completado }) {
    const progreso = new ProgresoEstacion({
      ninoId,
      estacionNum,
      nombreEstacion,
      datosActividad,
      completado,
    });

    return await this.progresoRepository.guardar(progreso);
  }
}

class ObtenerProgresoNinoUseCase {
  constructor(progresoRepository) {
    this.progresoRepository = progresoRepository;
  }

  async ejecutar(ninoId) {
    return await this.progresoRepository.obtenerPorNino(ninoId);
  }
}

class GuardarArtefactoMuralUseCase {
  constructor(progresoRepository) {
    this.progresoRepository = progresoRepository;
  }

  async ejecutar({ ninoId, tipo, autor, contenido }) {
    if (!tipo || !autor || !contenido) {
      throw new Error('Tipo, autor y contenido son obligatorios para el mural.');
    }
    return await this.progresoRepository.guardarArtefacto({
      ninoId,
      tipo,
      autor,
      contenido,
    });
  }
}

module.exports = {
  GuardarProgresoUseCase,
  ObtenerProgresoNinoUseCase,
  GuardarArtefactoMuralUseCase,
};
