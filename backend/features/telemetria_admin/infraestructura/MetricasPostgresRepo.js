const { pool, isPostgresConnected } = require('../../../db/connection');

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
      }
    }

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
