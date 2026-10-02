const { pool, isPostgresConnected } = require('../../../db/connection');

class ProgresoPostgresRepository {
  constructor() {
    this.memoriaProgreso = new Map();
    this.memoriaArtefactos = [];
  }

  async guardar(progreso) {
    const data = progreso.toJSON();
    if (isPostgresConnected()) {
      try {
        const query = `
          INSERT INTO progreso_estaciones (id, nino_id, estacion_num, nombre_estacion, datos_actividad, completado, actualizado_en)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            datos_actividad = EXCLUDED.datos_actividad,
            completado = EXCLUDED.completado,
            actualizado_en = EXCLUDED.actualizado_en
          RETURNING *;
        `;
        const values = [
          data.id,
          data.ninoId,
          data.estacionNum,
          data.nombreEstacion,
          JSON.stringify(data.datosActividad),
          data.completado,
          data.actualizadoEn,
        ];
        const res = await pool.query(query, values);
        return res.rows[0];
      } catch (err) {
        console.warn('Fallo en Postgres (progreso), usando memoria:', err.message);
      }
    }

    this.memoriaProgreso.set(data.id, data);
    return data;
  }

  async obtenerPorNino(ninoId) {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('SELECT * FROM progreso_estaciones WHERE nino_id = $1 ORDER BY estacion_num ASC', [ninoId]);
        return res.rows;
      } catch (err) {
        console.warn('Fallo en Postgres al obtener progreso:', err.message);
      }
    }
    return Array.from(this.memoriaProgreso.values()).filter(p => p.ninoId === ninoId);
  }

  async listarTodosProgresos() {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('SELECT * FROM progreso_estaciones ORDER BY actualizado_en DESC LIMIT 500');
        return res.rows;
      } catch (err) {
        console.warn('Fallo en Postgres al listar progreso:', err.message);
      }
    }
    return Array.from(this.memoriaProgreso.values()).reverse();
  }

  async guardarArtefacto({ ninoId, tipo, autor, contenido }) {
    const id = `art_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const creadoEn = new Date().toISOString();
    const data = { id, ninoId, tipo, autor, contenido, creadoEn };

    if (isPostgresConnected()) {
      try {
        const query = `
          INSERT INTO mural_artefactos (id, nino_id, tipo, autor, contenido, creado_en)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const res = await pool.query(query, [id, ninoId, tipo, autor, JSON.stringify(contenido), creadoEn]);
        return res.rows[0];
      } catch (err) {
        console.warn('Fallo en Postgres (artefacto):', err.message);
      }
    }

    this.memoriaArtefactos.push(data);
    return data;
  }

  async listarArtefactos(tipo = null) {
    if (isPostgresConnected()) {
      try {
        const query = tipo ? 'SELECT * FROM mural_artefactos WHERE tipo = $1 ORDER BY creado_en DESC' : 'SELECT * FROM mural_artefactos ORDER BY creado_en DESC';
        const params = tipo ? [tipo] : [];
        const res = await pool.query(query, params);
        return res.rows;
      } catch (err) {
        console.warn('Fallo en Postgres (listar artefactos):', err.message);
      }
    }
    if (tipo) return this.memoriaArtefactos.filter(a => a.tipo === tipo);
    return this.memoriaArtefactos;
  }

  async borrarArtefacto(id) {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('DELETE FROM mural_artefactos WHERE id = $1 RETURNING id', [id]);
        if (res.rowCount > 0) return true;
      } catch (err) {
        console.warn('Fallo en Postgres (borrar artefacto):', err.message);
      }
    }
    const before = this.memoriaArtefactos.length;
    this.memoriaArtefactos = this.memoriaArtefactos.filter(a => a.id !== id);
    return this.memoriaArtefactos.length < before;
  }

  async borrarPorNino(ninoId) {
    if (isPostgresConnected()) {
      try {
        await pool.query('DELETE FROM mural_artefactos WHERE nino_id = $1', [ninoId]);
        await pool.query('DELETE FROM progreso_estaciones WHERE nino_id = $1', [ninoId]);
      } catch (err) {
        console.warn('Fallo en Postgres (borrar datos de niño):', err.message);
      }
    }
    const beforeProgress = this.memoriaProgreso.size;
    const beforeArt = this.memoriaArtefactos.length;
    for (const [id, item] of this.memoriaProgreso.entries()) {
      if (item.ninoId === ninoId || item.nino_id === ninoId) this.memoriaProgreso.delete(id);
    }
    this.memoriaArtefactos = this.memoriaArtefactos.filter(a => (a.ninoId || a.nino_id) !== ninoId);
    return beforeProgress !== this.memoriaProgreso.size || beforeArt !== this.memoriaArtefactos.length;
  }
}

module.exports = { ProgresoPostgresRepository };
