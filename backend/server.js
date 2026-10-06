const { checkConnection, initSchema } = require('./db/connection');
const { createApp } = require('./http/createApp');

const app = createApp();
const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  await checkConnection();
  await initSchema();
  return app.listen(PORT, () => {
    console.log(`Servidor Backend iniciado en http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  iniciarServidor();
}

module.exports = { app, iniciarServidor };
