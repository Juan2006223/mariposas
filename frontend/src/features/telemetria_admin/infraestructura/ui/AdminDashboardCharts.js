(function () {
  function charts(stations, data = {}) {
    const stationValues = Object.entries(stations || {})
      .map(([label, value]) => ({ label: label.replace('Estación ', 'E'), value }));
    const days = (data.dias || []).map(row => ({ label: row.dia.slice(5), value: Number(row.total) }));
    const creations = (data.creaciones || []).map(row => ({ label: row.tipo, value: Number(row.total) }));
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-bottom:18px;text-align:left;">${[
      barChart('Interacciones por estación', stationValues),
      barChart('Actividad últimos 7 días', days),
      barChart('Creaciones por tipo', creations),
    ].join('')}</div>`;
  }

  function barChart(title, rows) {
    const max = Math.max(1, ...rows.map(row => row.value));
    const bars = rows.length ? rows.map(row => `
      <div style="display:grid;grid-template-columns:70px 1fr 32px;gap:7px;align-items:center;font-size:.78rem;color:var(--ink-soft);">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(row.label)}</span>
        <span style="height:10px;background:var(--card);border-radius:5px;overflow:hidden;">
          <i style="display:block;width:${Math.max(row.value ? 4 : 0, row.value / max * 100)}%;height:100%;background:var(--sol);"></i>
        </span>
        <b style="color:var(--ink);text-align:right;">${row.value}</b>
      </div>`).join('') : '<span style="font-size:.82rem;color:var(--ink-soft);">Aún no hay datos</span>';
    return `<section style="background:var(--card2);border:1px solid var(--line);border-radius:8px;padding:12px;"><h3 style="font-size:.95rem;color:var(--ink);margin:0 0 12px;">${title}</h3><div style="display:grid;gap:9px;">${bars}</div></section>`;
  }

  function summary(resumen) {
    const cards = [
      ['Total niños', resumen.totalNinos, `${resumen.ninosGrupoG1} de 6-8 | ${resumen.ninosGrupoG2} de 9-12`],
      ['Eventos', resumen.totalEventos, 'Actividad registrada'],
      ['Creaciones', resumen.totalArtefactosMural, 'Dibujos y mural'],
    ];
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px;text-align:left;">${cards.map(c => `
      <div style="background:var(--card2);border:1px solid var(--line);border-radius:8px;padding:14px;">
        <div style="font-size:.8rem;color:var(--ink-soft);">${c[0]}</div>
        <div style="font-size:1.8rem;font-weight:800;color:var(--sol);font-family:'Baloo 2';">${c[1]}</div>
        <div style="font-size:.75rem;color:var(--ink-soft);">${c[2]}</div>
      </div>`).join('')}</div>`;
  }

  window.AdminDashboardCharts = { charts, summary };
})();
