const { pool, isPostgresConnected, databaseUnavailableError } = require('../../../db/connection');

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
        if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError(err);
      }
    }

    if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError();

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

  async listarPagina(pagina = 1, limite = 20) {
    const offset = (pagina - 1) * limite;
    if (isPostgresConnected()) {
      try {
        const [rows, count] = await Promise.all([
          pool.query('SELECT * FROM perfiles_ninos ORDER BY creado_en DESC, id DESC LIMIT $1 OFFSET $2', [limite, offset]),
          pool.query('SELECT COUNT(*)::int AS total FROM perfiles_ninos'),
        ]);
        return { perfiles: rows.rows, total: count.rows[0].total };
      } catch (err) {
        console.warn('Fallo en Postgres al paginar perfiles:', err.message);
        if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError(err);
      }
    }
    if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError();
    const perfiles = Array.from(this.memoria.values()).reverse();
    return { perfiles: perfiles.slice(offset, offset + limite), total: perfiles.length };
  }

  async buscarPorId(id) {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('SELECT * FROM perfiles_ninos WHERE id = $1', [id]);
        return res.rows[0] || null;
      } catch (err) {
        console.warn('Fallo en Postgres al buscar por ID:', err.message);
        if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError(err);
      }
    }
    if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError();
    return this.memoria.get(id) || null;
  }

  async borrar(id) {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('DELETE FROM perfiles_ninos WHERE id = $1 RETURNING id', [id]);
        if (res.rowCount > 0) return true;
      } catch (err) {
        console.warn('Fallo en Postgres al borrar perfil:', err.message);
        if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError(err);
      }
    }
    if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError();
    return this.memoria.delete(id);
  }
}

module.exports = { PerfilPostgresRepository };
