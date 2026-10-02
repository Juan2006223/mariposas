// Adaptador cliente para comunicación HTTP con el Backend REST y Postgres
const API_BASE = window.API_BASE || `${window.location.origin}/api`;

const ApiClient = {
  async registrarPerfil({ nombre, avatar, edad, fechaNacimiento }) {
    try {
      const res = await fetch(`${API_BASE}/perfiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, avatar, edad, fechaNacimiento })
      });
      return await res.json();
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
      return await res.json();
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
      return await res.json();
    } catch (err) {
      return { success: false, fallback: true };
    }
  },

  async listarMural(tipo) {
    try {
      const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : '';
      const res = await fetch(`${API_BASE}/mural${query}`);
      return await res.json();
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
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async registrarMetrica({ ninoId, tipoEvento, categoria, detalles, duracionSegundos }) {
    try {
      await fetch(`${API_BASE}/metricas/evento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ninoId, tipoEvento, categoria, detalles, duracionSegundos })
      });
    } catch (e) {}
  },

  async obtenerDashboard(adminToken) {
    try {
      const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const res = await fetch(`${API_BASE}/admin/dashboard`, { headers });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
