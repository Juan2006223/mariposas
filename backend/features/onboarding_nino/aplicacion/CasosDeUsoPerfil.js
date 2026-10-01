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

module.exports = {
  RegistrarPerfilNinoUseCase,
  ObtenerPerfilesUseCase,
};
