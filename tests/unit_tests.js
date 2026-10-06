const assert = require('assert');
const { PerfilNino } = require('../backend/features/onboarding_nino/dominio/PerfilNino');
const { ProgresoEstacion } = require('../backend/features/estaciones_experiencia/dominio/ProgresoEstacion');
const { EventoMetrica } = require('../backend/features/telemetria_admin/dominio/EventoMetrica');

const { PerfilPostgresRepository } = require('../backend/features/onboarding_nino/infraestructura/PerfilPostgresRepo');
const { RegistrarPerfilNinoUseCase } = require('../backend/features/onboarding_nino/aplicacion/CasosDeUsoPerfil');

const { ProgresoPostgresRepository } = require('../backend/features/estaciones_experiencia/infraestructura/ProgresoPostgresRepo');
const { GuardarProgresoUseCase, GuardarArtefactoMuralUseCase } = require('../backend/features/estaciones_experiencia/aplicacion/CasosDeUsoProgreso');

const { MetricasPostgresRepository } = require('../backend/features/telemetria_admin/infraestructura/MetricasPostgresRepo');
const { RegistrarMetricaUseCase, ObtenerDashboardMetricasUseCase } = require('../backend/features/telemetria_admin/aplicacion/CasosDeUsoMetricas');
const { app } = require('../backend/server');

async function runTests() {
  console.log('🧪 Iniciando Suite de Pruebas Unitarias Automatizadas (Headless CLI)...');
  let testsPasados = 0;

  // 1. Dominio: PerfilNino
  try {
    const nino = new PerfilNino({ nombre: 'Sofía', avatar: 'mariposa_sol', edad: 7 });
    assert.strictEqual(nino.nombre, 'Sofía');
    assert.strictEqual(nino.grupoEdad, '6-8');
    assert.strictEqual(nino.avatar, 'mariposa_sol');
    testsPasados++;
    console.log('✅ Dominio PerfilNino: Creación válida (6-8 años).');

    const ninoMayor = new PerfilNino({ nombre: 'Mateo', avatar: 'oruga', edad: 11 });
    assert.strictEqual(ninoMayor.grupoEdad, '9-12');
    testsPasados++;
    console.log('✅ Dominio PerfilNino: Asignación automática de grupo (9-12 años).');

    assert.throws(() => new PerfilNino({ nombre: '', edad: 7 }), /nombre debe tener al menos 2 caracteres/);
    assert.throws(() => new PerfilNino({ nombre: 'Ana', edad: 25 }), /edad debe ser un número válido/);
    testsPasados++;
    console.log('✅ Dominio PerfilNino: Invariantes y rechazo de datos inválidos.');
  } catch (e) {
    console.error('❌ Fallo en Dominio PerfilNino:', e.message);
  }

  // 2. Dominio: ProgresoEstacion
  try {
    const progreso = new ProgresoEstacion({ estacionNum: 2, nombreEstacion: 'Pinta' });
    assert.strictEqual(progreso.completado, false);
    progreso.marcarCompletada({ color: '#FFC857' });
    assert.strictEqual(progreso.completado, true);
    assert.strictEqual(progreso.datosActividad.color, '#FFC857');
    testsPasados++;
    console.log('✅ Dominio ProgresoEstacion: Registro y completitud de estación.');

    assert.throws(() => new ProgresoEstacion({ estacionNum: 8 }), /estación debe estar entre 1 y 6/);
    testsPasados++;
    console.log('✅ Dominio ProgresoEstacion: Invariante de número de estación.');
  } catch (e) {
    console.error('❌ Fallo en Dominio ProgresoEstacion:', e.message);
  }

  // 3. Dominio: EventoMetrica
  try {
    const evento = new EventoMetrica({ tipoEvento: 'CLICK_HOTSPOT', categoria: 'navegacion', duracionSegundos: 12 });
    assert.strictEqual(evento.tipoEvento, 'CLICK_HOTSPOT');
    assert.strictEqual(evento.categoria, 'navegacion');
    testsPasados++;
    console.log('✅ Dominio EventoMetrica: Validación de telemetría.');
  } catch (e) {
    console.error('❌ Fallo en Dominio EventoMetrica:', e.message);
  }

  // 4. Aplicación: Casos de uso con In-Memory Repo
  try {
    const perfilRepo = new PerfilPostgresRepository();
    const registrarUC = new RegistrarPerfilNinoUseCase(perfilRepo);
    const nuevoPerfil = await registrarUC.ejecutar({ nombre: 'Camilo', avatar: 'colibri', edad: 8 });
    assert.strictEqual(nuevoPerfil.nombre, 'Camilo');
    const todos = await perfilRepo.listarTodos();
    assert.strictEqual(todos.length, 1);
    testsPasados++;
    console.log('✅ Aplicación Caso de Uso: RegistrarPerfilNinoUseCase.');

    const progresoRepo = new ProgresoPostgresRepository();
    const guardarProgresoUC = new GuardarProgresoUseCase(progresoRepo);
    await guardarProgresoUC.ejecutar({ ninoId: nuevoPerfil.id, estacionNum: 1, completado: true });
    const progresoNino = await progresoRepo.obtenerPorNino(nuevoPerfil.id);
    assert.strictEqual(progresoNino.length, 1);
    assert.strictEqual(progresoNino[0].completado, true);
    testsPasados++;
    console.log('✅ Aplicación Caso de Uso: GuardarProgresoUseCase.');

    const guardarMuralUC = new GuardarArtefactoMuralUseCase(progresoRepo);
    await guardarMuralUC.ejecutar({ ninoId: nuevoPerfil.id, tipo: 'mariposa', autor: 'Camilo', contenido: { ala: 'violeta' } });
    const artefactos = await progresoRepo.listarArtefactos('mariposa');
    assert.strictEqual(artefactos.length, 1);
    testsPasados++;
    console.log('✅ Aplicación Caso de Uso: GuardarArtefactoMuralUseCase.');

    const fakeStorage = {
      async subirDataUri(dataUri) {
        assert.ok(dataUri.startsWith('data:image/png;base64,'));
        return {
          url: 'https://res.cloudinary.com/demo/image/upload/mariposas/prueba.png',
          publicId: 'mariposas/prueba',
          formato: 'png',
          ancho: 100,
          alto: 80,
          bytes: 1234,
        };
      },
    };
    const guardarMuralConImagenUC = new GuardarArtefactoMuralUseCase(progresoRepo, fakeStorage);
    await guardarMuralConImagenUC.ejecutar({
      ninoId: nuevoPerfil.id,
      tipo: 'mariposa',
      autor: 'Camilo',
      contenido: { type: 'image', src: 'data:image/png;base64,aW1hZ2Vu', name: 'Camilo' },
    });
    const artefactoImagen = (await progresoRepo.listarArtefactos('mariposa')).find(a => {
      const contenido = a.contenido || {};
      return contenido.storage === 'cloudinary';
    });
    assert.ok(artefactoImagen);
    assert.strictEqual(artefactoImagen.contenido.src, 'https://res.cloudinary.com/demo/image/upload/mariposas/prueba.png');
    assert.strictEqual(artefactoImagen.contenido.cloudinaryPublicId, 'mariposas/prueba');
    assert.ok(!artefactoImagen.contenido.src.startsWith('data:image/'));
    testsPasados++;
    console.log('✅ Aplicación Caso de Uso: imágenes del mural se suben a Cloudinary antes de guardar.');

    const metricasRepo = new MetricasPostgresRepository();
    const registrarMetricaUC = new RegistrarMetricaUseCase(metricasRepo);
    await registrarMetricaUC.ejecutar({ ninoId: nuevoPerfil.id, tipoEvento: 'VISITA_MAPA', categoria: 'estacion', detalles: { estacion: 4 } });
    const dashboardUC = new ObtenerDashboardMetricasUseCase(metricasRepo, perfilRepo, progresoRepo);
    const dashData = await dashboardUC.ejecutar();
    assert.strictEqual(dashData.resumen.totalNinos, 1);
    assert.strictEqual(dashData.resumen.ninosGrupoG1, 1);
    assert.strictEqual(dashData.estacionesVisitadas['Estación 4'], 1);
    testsPasados++;
    console.log('✅ Aplicación Caso de Uso: ObtenerDashboardMetricasUseCase (Cálculo estadístico correcto).');
  } catch (e) {
    console.error('❌ Fallo en Pruebas de Aplicación:', e.message);
  }

  console.log(`\n🎉 Total de pruebas ejecutadas con éxito: ${testsPasados}/11`);
  if (testsPasados === 11) {
    console.log('🏆 SUITE DE PRUEBAS UNITARIAS: 100% EN VERDE ✅');
  } else {
    process.exit(1);
  }

  await runSecurityTests();
}

function listenTestServer() {
  return new Promise(resolve => {
    const server = app.listen(0, () => resolve(server));
  });
}

async function runSecurityTests() {
  console.log('\n🔐 Iniciando pruebas de seguridad HTTP...');
  const previousNodeEnv = process.env.NODE_ENV;
  const previousAdminToken = process.env.ADMIN_API_TOKEN;
  process.env.NODE_ENV = 'production';
  process.env.ADMIN_API_TOKEN = 'token-pruebas';

  const server = await listenTestServer();
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    const health = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: 'http://localhost:3000' },
    });
    assert.strictEqual(health.headers.get('x-powered-by'), null);
    assert.strictEqual(health.headers.get('x-frame-options'), 'DENY');
    assert.strictEqual(health.headers.get('x-content-type-options'), 'nosniff');
    assert.strictEqual(health.headers.get('access-control-allow-origin'), 'http://localhost:3000');
    console.log('✅ Seguridad HTTP: cabeceras y CORS permitido.');

    const blockedAdmin = await fetch(`${baseUrl}/api/admin/dashboard`);
    assert.strictEqual(blockedAdmin.status, 401);
    console.log('✅ Seguridad HTTP: dashboard administrativo requiere token.');

    const allowedAdmin = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: 'Bearer token-pruebas' },
    });
    assert.strictEqual(allowedAdmin.status, 200);
    console.log('✅ Seguridad HTTP: token administrativo válido permite acceso.');

    const created = await fetch(`${baseUrl}/api/perfiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Usuario Borrable', avatar: 'butterfly', edad: 8 }),
    });
    const createdBody = await created.json();
    assert.strictEqual(created.status, 201);
    const blockedDelete = await fetch(`${baseUrl}/api/perfiles/${createdBody.data.id}`, { method: 'DELETE' });
    assert.strictEqual(blockedDelete.status, 401);
    const allowedDelete = await fetch(`${baseUrl}/api/perfiles/${createdBody.data.id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer token-pruebas' },
    });
    assert.strictEqual(allowedDelete.status, 200);
    console.log('✅ Seguridad HTTP: borrado de usuarios requiere token admin y funciona.');
  } finally {
    server.close();
    process.env.NODE_ENV = previousNodeEnv;
    if (previousAdminToken === undefined) {
      delete process.env.ADMIN_API_TOKEN;
    } else {
      process.env.ADMIN_API_TOKEN = previousAdminToken;
    }
  }
}

runTests();
