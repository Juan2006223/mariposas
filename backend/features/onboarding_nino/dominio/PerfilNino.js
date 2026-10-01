class PerfilNino {
  constructor({ id, nombre, avatar, edad, fechaNacimiento, grupoEdad, creadoEn }) {
    this.validarNombre(nombre);
    this.validarEdad(edad);

    this.id = id || `nino_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this.nombre = nombre.trim();
    this.avatar = avatar || 'mariposa_azul';
    this.edad = parseInt(edad);
    this.fechaNacimiento = fechaNacimiento || null;
    this.grupoEdad = grupoEdad || (this.edad <= 8 ? '6-8' : '9-12');
    this.creadoEn = creadoEn || new Date().toISOString();
  }

  validarNombre(nombre) {
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres.');
    }
  }

  validarEdad(edad) {
    const num = parseInt(edad);
    if (isNaN(num) || num < 4 || num > 18) {
      throw new Error('La edad debe ser un número válido entre 4 y 18 años.');
    }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      avatar: this.avatar,
      edad: this.edad,
      fechaNacimiento: this.fechaNacimiento,
      grupoEdad: this.grupoEdad,
      creadoEn: this.creadoEn,
    };
  }
}

module.exports = { PerfilNino };
