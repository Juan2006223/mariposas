const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE || 'alas_mariposa_db',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: true } : undefined,
  connectionTimeoutMillis: 2000,
});

let isConnected = false;

async function checkConnection() {
  try {
    const client = await pool.connect();
    isConnected = true;
    client.release();
    console.log('✅ Conexión exitosa a PostgreSQL');
    return true;
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ No se pudo conectar a PostgreSQL local:', err.message);
    console.warn('ℹ️ El backend operará en modo memoria de respaldo con sincronización reactiva.');
    return false;
  }
}

async function initSchema() {
  if (!isConnected) return false;
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Esquema DDL de PostgreSQL verificado e inicializado.');
    return true;
  } catch (err) {
    console.error('❌ Error al ejecutar schema DDL en PostgreSQL:', err.message);
    return false;
  }
}

module.exports = {
  pool,
  checkConnection,
  initSchema,
  isPostgresConnected: () => isConnected,
};
