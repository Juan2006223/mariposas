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
  constructor(progresoRepository, assetStorage = null) {
    this.progresoRepository = progresoRepository;
    this.assetStorage = assetStorage;
  }

  async ejecutar({ ninoId, tipo, autor, contenido }) {
    if (!tipo || !autor || !contenido) {
      throw new Error('Tipo, autor y contenido son obligatorios para el mural.');
    }
    const contenidoProcesado = await this.procesarImagenes(contenido, { ninoId, tipo });
    return await this.progresoRepository.guardarArtefacto({
      ninoId,
      tipo,
      autor,
      contenido: contenidoProcesado,
    });
  }

  async procesarImagenes(contenido, { ninoId, tipo }) {
    if (!this.esImagenDataUri(contenido.src)) return contenido;
    if (!this.assetStorage) {
      throw new Error('No hay almacenamiento de imágenes configurado para el mural.');
    }

    const publicId = [
      tipo || 'mural',
      ninoId || 'anon',
      Date.now(),
    ].join('_').replace(/[^a-zA-Z0-9_-]/g, '_');

    const asset = await this.assetStorage.subirDataUri(contenido.src, { publicId });
    return {
      ...contenido,
      src: asset.url,
      cloudinaryPublicId: asset.publicId,
      storage: 'cloudinary',
      imageMeta: {
        formato: asset.formato,
        ancho: asset.ancho,
        alto: asset.alto,
        bytes: asset.bytes,
      },
    };
  }

  esImagenDataUri(src) {
    return typeof src === 'string' && /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(src);
  }
}

module.exports = {
  GuardarProgresoUseCase,
  ObtenerProgresoNinoUseCase,
  GuardarArtefactoMuralUseCase,
};
