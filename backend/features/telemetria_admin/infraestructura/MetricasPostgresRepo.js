const { pool, isPostgresConnected, databaseUnavailableError } = require('../../../db/connection');

class MetricasPostgresRepository {
  constructor() {
    this.memoriaEventos = [];
  }

  async guardar(metrica) {
    const data = metrica.toJSON();
    if (isPostgresConnected()) {
      try {
        const query = `
          INSERT INTO metricas_eventos (id, nino_id, tipo_evento, categoria, detalles, duracion_segundos, timestamp_evento)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        const values = [
          data.id,
          data.ninoId,
          data.tipoEvento,
          data.categoria,
          JSON.stringify(data.detalles),
          data.duracionSegundos,
          data.timestamp,
        ];
        const res = await pool.query(query, values);
        return res.rows[0];
      } catch (err) {
        console.warn('Fallo en Postgres (métrica), usando memoria:', err.message);
        if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError(err);
      }
    }

    if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError();

    this.memoriaEventos.push(data);
    return data;
  }

  async listarEventos() {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('SELECT * FROM metricas_eventos ORDER BY timestamp_evento DESC LIMIT 500');
        return res.rows;
      } catch (err) {
        console.warn('Fallo en Postgres al listar métricas:', err.message);
      }
    }
    return [...this.memoriaEventos].reverse();
  }

  async listarPorNino(ninoId) {
    if (isPostgresConnected()) {
      try {
        const res = await pool.query('SELECT * FROM metricas_eventos WHERE nino_id = $1 ORDER BY timestamp_evento DESC LIMIT 100', [ninoId]);
        return res.rows;
      } catch (err) {
        console.warn('Fallo en Postgres al consultar eventos del niño:', err.message);
        if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError(err);
      }
    }
    if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError();
    return this.memoriaEventos.filter(e => (e.ninoId || e.nino_id) === ninoId).slice(-100).reverse();
  }

  async obtenerAgregadosDashboard() {
    if (isPostgresConnected()) {
      try {
        const [estaciones, dias, categorias, grupos, eventos, perfiles, artefactos] = await Promise.all([
          pool.query("WITH eventos AS (SELECT detalles->>'estacion' AS estacion, COUNT(*)::int AS total FROM metricas_eventos WHERE categoria = 'estacion' AND detalles->>'estacion' IS NOT NULL GROUP BY 1), avances AS (SELECT estacion_num::text AS estacion, COUNT(*)::int AS total FROM progreso_estaciones GROUP BY 1) SELECT COALESCE(eventos.estacion, avances.estacion) AS estacion, GREATEST(COALESCE(eventos.total, 0), COALESCE(avances.total, 0))::int AS total FROM eventos FULL JOIN avances USING (estacion) ORDER BY 1"),
          pool.query("SELECT TO_CHAR(DATE_TRUNC('day', timestamp_evento), 'YYYY-MM-DD') AS dia, COUNT(*)::int AS total FROM metricas_eventos WHERE timestamp_evento >= NOW() - INTERVAL '6 days' GROUP BY 1 ORDER BY 1"),
          pool.query('SELECT tipo, COUNT(*)::int AS total FROM mural_artefactos GROUP BY tipo ORDER BY tipo'),
          pool.query("SELECT grupo_edad, COUNT(*)::int AS total FROM perfiles_ninos GROUP BY grupo_edad"),
          pool.query('SELECT COUNT(*)::int AS total FROM metricas_eventos'),
          pool.query('SELECT COUNT(*)::int AS total FROM perfiles_ninos'),
          pool.query('SELECT COUNT(*)::int AS total FROM mural_artefactos'),
        ]);
        return { estaciones: estaciones.rows, dias: dias.rows, creaciones: categorias.rows, grupos: grupos.rows, totalEventos: eventos.rows[0].total, totalNinos: perfiles.rows[0].total, totalCreaciones: artefactos.rows[0].total };
      } catch (err) {
        console.warn('Fallo en Postgres al agregar datos del dashboard:', err.message);
        if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError(err);
      }
    }
    if (process.env.REQUIRE_DATABASE === 'true') throw databaseUnavailableError();
    return null;
  }

  async borrarPorNino(ninoId) {
    if (isPostgresConnected()) {
      try {
        await pool.query('DELETE FROM metricas_eventos WHERE nino_id = $1', [ninoId]);
      } catch (err) {
        console.warn('Fallo en Postgres al borrar métricas del niño:', err.message);
      }
    }
    const before = this.memoriaEventos.length;
    this.memoriaEventos = this.memoriaEventos.filter(e => (e.ninoId || e.nino_id) !== ninoId);
    return this.memoriaEventos.length < before;
  }
}

module.exports = { MetricasPostgresRepository };
