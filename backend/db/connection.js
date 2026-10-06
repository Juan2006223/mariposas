const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

function buildPoolConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: true },
      connectionTimeoutMillis: 15000,
    };
  }

  return {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'alas_mariposa_db',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: true } : undefined,
    connectionTimeoutMillis: 15000,
  };
}

const pool = new Pool(buildPoolConfig());

let isConnected = false;

function databaseUnavailableError(cause) {
  const error = new Error('Neon no está disponible. Los datos no se guardaron; intenta de nuevo.');
  error.code = 'DATABASE_UNAVAILABLE';
  if (cause) error.cause = cause;
  return error;
}

async function checkConnection() {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const client = await pool.connect();
      isConnected = true;
      client.release();
      console.log('✅ Conexión exitosa a PostgreSQL');
      return true;
    } catch (err) {
      isConnected = false;
      console.warn(`⚠️ Intento ${attempt}/3 de PostgreSQL falló:`, err.message);
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 1500));
    }
  }
  console.warn('ℹ️ PostgreSQL sigue desconectado; se reintentará en segundo plano.');
  return false;
}

pool.on('error', err => {
  isConnected = false;
  console.warn('⚠️ Conexión inactiva de PostgreSQL perdió el enlace:', err.message);
});

const reconnectTimer = setInterval(() => {
  if (!isConnected) checkConnection();
}, 15000);
reconnectTimer.unref();

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
  databaseUnavailableError,
};
