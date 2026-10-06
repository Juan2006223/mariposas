// Adaptador cliente para comunicación HTTP con el Backend REST y Postgres
const API_BASE = window.API_BASE || `${window.location.origin}/api`;

async function readApiJson(res) {
  const text = await res.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch (err) {
    return { success: false, error: `Respuesta inválida del backend (${res.status}).` };
  }
  if (!res.ok && body.success !== false) {
    body.success = false;
    body.error = body.error || `Error del backend (${res.status}).`;
  }
  return body;
}

const ApiClient = {
  async registrarPerfil({ nombre, avatar, edad, fechaNacimiento }) {
    try {
      const res = await fetch(`${API_BASE}/perfiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, avatar, edad, fechaNacimiento })
      });
      return await readApiJson(res);
    } catch (err) {
      console.warn('API local no disponible, operando en almacenamiento local:', err.message);
      return { success: false, fallback: true };
    }
  },

  async guardarProgreso({ ninoId, estacionNum, nombreEstacion, datosActividad, completado }) {
    try {
      const res = await fetch(`${API_BASE}/progreso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ninoId, estacionNum, nombreEstacion, datosActividad, completado })
      });
      return await readApiJson(res);
    } catch (err) {
      return { success: false, fallback: true };
    }
  },

  async guardarArtefactoMural({ ninoId, tipo, autor, contenido }) {
    try {
      const res = await fetch(`${API_BASE}/mural`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ninoId, tipo, autor, contenido })
      });
      return await readApiJson(res);
    } catch (err) {
      return { success: false, fallback: true };
    }
  },

  async listarMural(tipo) {
    try {
      const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : '';
      const res = await fetch(`${API_BASE}/mural${query}`);
      return await readApiJson(res);
    } catch (err) {
      return { success: false, data: [], error: err.message };
    }
  },

  async borrarArtefactoMural(id, adminToken) {
    try {
      const res = await fetch(`${API_BASE}/mural/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      });
      return await readApiJson(res);
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async borrarPerfil(id, adminToken) {
    try {
      const res = await fetch(`${API_BASE}/perfiles/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      });
      return await readApiJson(res);
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async registrarMetrica({ ninoId, tipoEvento, categoria, detalles, duracionSegundos }) {
    try {
      const res = await fetch(`${API_BASE}/metricas/evento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ninoId, tipoEvento, categoria, detalles, duracionSegundos })
      });
      return await readApiJson(res);
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async obtenerDashboard(adminToken, pagina = 1) {
    try {
      const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const res = await fetch(`${API_BASE}/admin/dashboard?pagina=${encodeURIComponent(pagina)}&limite=20`, { headers });
      return await readApiJson(res);
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  async obtenerEspacioParticipante(id, adminToken) {
    try {
      const res = await fetch(`${API_BASE}/admin/participantes/${encodeURIComponent(id)}/espacio`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      });
      return await readApiJson(res);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
