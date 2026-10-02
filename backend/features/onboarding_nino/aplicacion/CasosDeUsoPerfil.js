const { PerfilNino } = require('../dominio/PerfilNino');

class RegistrarPerfilNinoUseCase {
  constructor(perfilRepository) {
    this.perfilRepository = perfilRepository;
  }

  async ejecutar({ nombre, avatar, edad, fechaNacimiento }) {
    const perfil = new PerfilNino({
      nombre,
      avatar,
      edad,
      fechaNacimiento,
    });

    return await this.perfilRepository.guardar(perfil);
  }
}

class ObtenerPerfilesUseCase {
  constructor(perfilRepository) {
    this.perfilRepository = perfilRepository;
  }

  async ejecutar() {
    return await this.perfilRepository.listarTodos();
  }
}

class BorrarPerfilNinoUseCase {
  constructor(perfilRepository, progresoRepository, metricasRepository) {
    this.perfilRepository = perfilRepository;
    this.progresoRepository = progresoRepository;
    this.metricasRepository = metricasRepository;
  }

  async ejecutar(id) {
    if (!id) throw new Error('El id del perfil es requerido.');
    const perfil = await this.perfilRepository.buscarPorId(id);
    if (!perfil) return false;
    if (this.metricasRepository.borrarPorNino) await this.metricasRepository.borrarPorNino(id);
    if (this.progresoRepository.borrarPorNino) await this.progresoRepository.borrarPorNino(id);
    return await this.perfilRepository.borrar(id);
  }
}

module.exports = {
  BorrarPerfilNinoUseCase,
  RegistrarPerfilNinoUseCase,
  ObtenerPerfilesUseCase,
};
