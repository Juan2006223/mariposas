(function () {
  function list(profiles, pageInfo) {
    return `
      <div style="background:var(--card2);border:1px solid var(--line);border-radius:8px;padding:16px;text-align:left;">
        <h3 style="font-family:'Baloo 2',sans-serif;font-size:1.1rem;color:var(--ink);margin:0 0 10px;">Participantes</h3>
        <div style="color:var(--ink-soft);font-size:.82rem;margin-bottom:12px;">${pageLabel(pageInfo)}</div>
        ${cards(profiles || [])}
        ${pagination(pageInfo)}
      </div>`;
  }

  function cards(profiles) {
    if (!profiles.length) return '<div style="color:var(--ink-soft);">No hay registros aún.</div>';
    return profiles.map((p, i) => {
      const name = p.nombre || 'Sin nombre';
      const pid = p.id || p.nino_id;
      const arts = Number(p.creaciones ?? p.dibujos ?? 0);
      const answers = Number(p.respuestas || 0);
      return `
        <section style="border:1px solid var(--line);background:var(--card);border-radius:8px;margin-bottom:10px;overflow:hidden;">
          <div style="padding:14px 16px;display:grid;grid-template-columns:44px 1fr auto auto;gap:12px;align-items:center;text-align:left;">
            <span title="Avatar elegido: ${escapeHtml(p.avatar || 'mariposa')}" style="width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,var(--violeta),var(--rosa));display:grid;place-items:center;font-weight:900;font-size:1.55rem;">${typeof miIcon === 'function' ? miIcon(p.avatar || 'mariposa') : initials(name)}</span>
            <span style="min-width:0;"><strong style="display:block;color:var(--violeta-suave);font-size:1.05rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(name)}</strong><small style="color:var(--ink-soft);">${p.edad} años · ${p.grupo_edad || p.grupoEdad || ''} · ${arts} creación(es) · ${answers} avance(s)</small></span>
            <button onclick="toggleParticipantDetail('${attrEscape(pid)}',${i})" style="background:rgba(255,200,87,.16);border:1px solid rgba(255,200,87,.4);color:var(--sol);border-radius:8px;padding:10px 14px;font-weight:900;cursor:pointer;">Ver todo</button>
            <button onclick="deleteParticipant('${attrEscape(pid)}','${attrEscape(name)}')" style="background:rgba(217,70,181,.20);border:1px solid rgba(217,70,181,.55);color:var(--ink);border-radius:8px;padding:10px 12px;font-weight:900;cursor:pointer;">Borrar</button>
          </div>
          <div id="childDetail${i}" style="display:none;border-top:1px solid var(--line);padding:14px 16px;">Cargando actividad guardada...</div>
        </section>`;
    }).join('');
  }

  function childSpace(events = [], arts = [], answers = []) {
    const insight = participantInsight(events, arts, answers);
    const words = wordMap(events, arts, answers);
    return `
      <div style="display:grid;grid-template-columns:1fr;gap:14px;">
        <div style="background:rgba(255,200,87,.09);border:1px solid rgba(255,200,87,.28);border-radius:8px;padding:12px;"><b style="color:var(--sol);display:block;margin-bottom:6px;">Lectura rápida</b><div style="color:var(--ink);font-size:.86rem;line-height:1.5;">${insight}</div></div>
        <div><b style="color:var(--sol);display:block;margin-bottom:8px;">Creaciones guardadas</b>${arts.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,210px));gap:10px;">${arts.map(muralCard).join('')}</div>` : empty()}</div>
        <div><b style="color:var(--sol);display:block;margin-bottom:8px;">Mapa de palabras</b>${words || empty()}</div>
        <div><b style="color:var(--sol);display:block;margin-bottom:8px;">Avances</b>${answers.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;">${answers.map(answerCard).join('')}</div>` : empty()}</div>
        <div><b style="color:var(--sol);display:block;margin-bottom:8px;">Eventos recientes</b>${events.length ? `<ul style="padding-left:18px;margin:0;">${events.map(eventItem).join('')}</ul>` : empty()}</div>
      </div>`;
  }

  function answerCard(item) {
    const data = parseMaybeJson(item.datos_actividad || item.datosActividad || {});
    const title = item.nombre_estacion || item.nombreEstacion || `Estación ${item.estacion_num || item.estacionNum || ''}`;
    const details = Object.keys(data).length ? Object.entries(data).map(([k, v]) => `<div style="font-size:.78rem;color:var(--ink-soft);"><b style="color:var(--ink);">${escapeHtml(k)}:</b> ${escapeHtml(formatValue(v))}</div>`).join('') : '<div style="font-size:.78rem;color:var(--ink-soft);">Sin detalle adicional.</div>';
    return `<article style="background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px;"><div style="color:var(--violeta-suave);font-weight:900;margin-bottom:6px;">${escapeHtml(title)}</div>${details}</article>`;
  }

  function eventItem(e) {
    const details = parseMaybeJson(e.detalles || {});
    const label = details.estacion ? `Estación ${details.estacion}` : (details.tipo || details.autor || e.categoria || '');
    return `<li style="margin:6px 0;color:var(--ink-soft);"><b style="color:var(--ink);">${escapeHtml(e.tipo_evento || e.tipoEvento || 'Evento')}</b> · ${escapeHtml(label)}</li>`;
  }

  function muralCard(item) {
    const content = parseMaybeJson(item.contenido || {});
    const response = content.text || content.message || content.place || '';
    const src = content.src || content.imageUrl || content.url || '';
    const image = /^https?:\/\//i.test(String(src)) ? `<button onclick="openAdminCreation('${attrEscape(src)}','${attrEscape(content.butterflyName || content.nombre || 'Creación guardada')}')" aria-label="Ver creación en grande" style="display:block;width:100%;padding:0;border:0;background:#fff;border-radius:6px;cursor:zoom-in;"><img src="${attrEscape(src)}" alt="Creación guardada, abrir en grande" style="display:block;width:100%;aspect-ratio:1;object-fit:contain;border-radius:6px;"></button>` : '';
    return `<div style="background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px;">${image}<div style="color:var(--ink);font-weight:800;overflow-wrap:anywhere;">${escapeHtml(content.butterflyName || content.nombre || item.tipo || 'mural')}</div><div style="color:var(--ink-soft);font-size:.75rem;">${escapeHtml(item.tipo || 'mural')} · guardado</div><button onclick="deleteMuralItem('${attrEscape(item.id)}')" style="margin-top:8px;border:1px solid var(--line);background:rgba(217,70,181,.18);color:var(--ink);border-radius:8px;padding:7px 9px;cursor:pointer;">Borrar</button>${response ? `<p style="margin:8px 0 0;color:var(--ink-soft);font-size:.82rem;overflow-wrap:anywhere;">${escapeHtml(response)}</p>` : ''}</div>`;
  }

  function participantInsight(events, arts, answers) {
    const stations = [...new Set([
      ...answers.map(x => x.estacion_num || x.estacionNum).filter(Boolean),
      ...events.map(x => parseMaybeJson(x.detalles).estacion).filter(Boolean),
    ])].sort((a, b) => Number(a) - Number(b));
    const creations = arts.map(x => {
      const data = parseMaybeJson(x.contenido);
      return data.butterflyName || data.nombre || x.tipo;
    }).filter(Boolean);
    const stationText = stations.length ? `exploró las estaciones ${stations.join(', ')}` : 'todavía no registra estaciones exploradas';
    const creationText = creations.length ? `guardó ${creations.length} creación${creations.length === 1 ? '' : 'es'} (${creations.slice(0, 3).map(escapeHtml).join(', ')})` : 'todavía no tiene creaciones guardadas';
    return `${stationText}, ${creationText} y tiene ${answers.length} avance${answers.length === 1 ? '' : 's'} registrado${answers.length === 1 ? '' : 's'}.`;
  }

  function wordMap(events, arts, answers) {
    const bag = [];
    events.forEach(e => bag.push(e.tipo_evento || e.tipoEvento, e.categoria, parseMaybeJson(e.detalles).tipo));
    arts.forEach(a => { const d = parseMaybeJson(a.contenido); bag.push(a.tipo, d.butterflyName, d.place, d.category); });
    answers.forEach(a => { const d = parseMaybeJson(a.datos_actividad || a.datosActividad); bag.push(a.nombre_estacion || a.nombreEstacion, ...Object.values(d)); });
    const counts = {};
    bag.flatMap(value => String(value || '').toLowerCase().match(/[a-záéíóúüñ]{4,}/gi) || []).forEach(word => {
      if (!['evento', 'avance', 'estacion', 'registro', 'mural'].includes(word)) counts[word] = (counts[word] || 0) + 1;
    });
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14);
    if (!ranked.length) return '';
    const max = ranked[0][1];
    return `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px;">${ranked.map(([word, count]) => `<span title="${count} aparición${count === 1 ? '' : 'es'}" style="font-size:${.78 + count / max * .72}rem;color:${count === max ? 'var(--sol)' : 'var(--violeta-suave)'};font-weight:${count === max ? 900 : 700};">${escapeHtml(word)}</span>`).join('')}</div>`;
  }

  function openAdminCreation(src, title) {
    const old = document.getElementById('adminCreationViewer');
    if (old) old.remove();
    const viewer = document.createElement('div');
    viewer.id = 'adminCreationViewer';
    viewer.style.cssText = 'position:fixed;inset:0;z-index:1200;background:rgba(10,4,20,.94);display:flex;align-items:center;justify-content:center;padding:24px;cursor:zoom-out;';
    viewer.innerHTML = `<div style="max-width:680px;width:100%;text-align:center;color:var(--ink);"><img src="${attrEscape(src)}" alt="${attrEscape(title)}" style="max-width:100%;max-height:75vh;object-fit:contain;background:#fff;border-radius:12px;"><div style="margin-top:12px;font-weight:800;">${escapeHtml(title)}</div><button type="button" style="margin-top:12px;padding:9px 16px;border-radius:8px;border:1px solid var(--line);background:var(--card2);color:var(--ink);cursor:pointer;">Cerrar</button></div>`;
    viewer.onclick = event => { if (event.target === viewer || event.target.tagName === 'BUTTON') viewer.remove(); };
    document.body.appendChild(viewer);
  }

  function pagination(page) {
    if (!page || page.paginas <= 1) return '';
    return `<nav aria-label="Paginación de participantes" style="display:flex;justify-content:center;align-items:center;gap:14px;padding:14px;"><button ${page.actual <= 1 ? 'disabled' : ''} onclick="cargarMetricasEnDashboard(document.getElementById('adminDashboardOverlay'),${page.actual - 1})">Anterior</button><span style="color:var(--ink-soft);">Página ${page.actual} de ${page.paginas}</span><button ${page.actual >= page.paginas ? 'disabled' : ''} onclick="cargarMetricasEnDashboard(document.getElementById('adminDashboardOverlay'),${page.actual + 1})">Siguiente</button></nav>`;
  }

  function pageLabel(page) {
    if (!page || !page.total) return 'Sin participantes';
    return `Mostrando ${(page.actual - 1) * page.limite + 1}-${Math.min(page.actual * page.limite, page.total)} de ${page.total}`;
  }

  function empty() { return '<div style="color:var(--ink-soft);">Sin datos guardados.</div>'; }
  function initials(name) { return String(name).trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase(); }
  function parseMaybeJson(value) { if (!value) return {}; if (typeof value === 'object') return value; try { return JSON.parse(value); } catch (e) { return {}; } }
  function formatValue(value) { return value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''); }

  window.AdminDashboardParticipants = { childSpace, list };
  window.openAdminCreation = openAdminCreation;
})();
