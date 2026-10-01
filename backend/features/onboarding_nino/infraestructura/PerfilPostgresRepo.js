const { pool, isPostgresConnected } = require('../../../db/connection');

class PerfilPostgresRepository {
  constructor() {
    this.memoria = new Map();
  }

  async guardar(perfil) {
    const data = perfil.toJSON();
    if (isPostgresConnected()) {
      try {
        const query = `
          INSERT INTO perfiles_ninos (id, nombre, avatar, edad, fecha_nacimiento, grupo_edad, creado_en)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            avatar = EXCLUDED.avatar,
            edad = EXCLUDED.edad,
            fecha_nacimiento = EXCLUDED.fecha_nacimiento,
            grupo_edad = EXCLUDED.grupo_edad
          RETURNING *;
        `;
        const values = [
          data.id,
          data.nombre,
          data.avatar,
          data.edad,
          data.fechaNacimiento,
          data.grupoEdad,
          data.creadoEn,
        ];
        const res = await pool.query(query, values);
        return res.rows[0];
      } catch (err) {
        console.warn('Fallo en Postgres, guardando en fallback de memoria:', err.message);
      }
    }

    this.memoria.set(data.id, data);
    return data;
  }

  async listarTodos() {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('SELECT * FROM perfiles_ninos ORDER BY creado_en DESC');
        return res.rows;
      } catch (err) {
        console.warn('Fallo en Postgres, leyendo de memoria:', err.message);
      }
    }
    return Array.from(this.memoria.values());
  }

  async buscarPorId(id) {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('SELECT * FROM perfiles_ninos WHERE id = $1', [id]);
        return res.rows[0] || null;
      } catch (err) {
        console.warn('Fallo en Postgres al buscar por ID:', err.message);
      }
    }
    return this.memoria.get(id) || null;
  }
}

module.exports = { PerfilPostgresRepository };
