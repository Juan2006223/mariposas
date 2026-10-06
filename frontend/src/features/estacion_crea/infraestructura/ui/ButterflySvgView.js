// frontend/src/features/estacion_crea/infraestructura/ui/ButterflySvgView.js
(function () {
  function butterflySvg(colors) {
    const c = colors || window.zoneColorMap || (window.CreaPaletteData && window.CreaPaletteData.DEFAULT_ZONE_COLORS_68) || {};
    return `<svg width="340" height="272" viewBox="0 0 200 160" id="butterflySvg" class="idle-shiver">
        <path id="wingLU" class="zone" d="M100,78 C80,30 30,18 15,45 C3,68 20,92 55,90 C75,89 92,85 100,78 Z" fill="${c.wingLU || '#3A2E52'}" onclick="paintZone('wingLU')"/>
        <path id="wingLD" class="zone" d="M55,90 C35,95 15,105 18,128 C20,148 45,152 60,135 C70,123 78,108 100,100 C85,92 70,88 55,90 Z" fill="${c.wingLD || '#453466'}" onclick="paintZone('wingLD')"/>
        <path id="wingRU" class="zone" d="M100,78 C120,30 170,18 185,45 C197,68 180,92 145,90 C125,89 108,85 100,78 Z" fill="${c.wingRU || '#3A2E52'}" onclick="paintZone('wingRU')"/>
        <path id="wingRD" class="zone" d="M145,90 C165,95 185,105 182,128 C180,148 155,152 140,135 C130,123 122,108 100,100 C115,92 130,88 145,90 Z" fill="${c.wingRD || '#453466'}" onclick="paintZone('wingRD')"/>
        <circle id="spotLU1" class="zone" cx="28" cy="45" r="7" fill="${c.spotLU1 || '#22193A'}" onclick="paintZone('spotLU1')"/>
        <circle id="spotLU2" class="zone" cx="60" cy="38" r="6" fill="${c.spotLU2 || '#22193A'}" onclick="paintZone('spotLU2')"/>
        <circle id="spotLD1" class="zone" cx="28" cy="118" r="6" fill="${c.spotLD1 || '#22193A'}" onclick="paintZone('spotLD1')"/>
        <circle id="spotLD2" class="zone" cx="62" cy="115" r="6" fill="${c.spotLD2 || '#22193A'}" onclick="paintZone('spotLD2')"/>
        <circle id="spotRU1" class="zone" cx="172" cy="45" r="7" fill="${c.spotRU1 || '#22193A'}" onclick="paintZone('spotRU1')"/>
        <circle id="spotRU2" class="zone" cx="140" cy="38" r="6" fill="${c.spotRU2 || '#22193A'}" onclick="paintZone('spotRU2')"/>
        <circle id="spotRD1" class="zone" cx="172" cy="118" r="6" fill="${c.spotRD1 || '#22193A'}" onclick="paintZone('spotRD1')"/>
        <circle id="spotRD2" class="zone" cx="138" cy="115" r="6" fill="${c.spotRD2 || '#22193A'}" onclick="paintZone('spotRD2')"/>
        <path d="M96,52 C88,35 78,28 74,18" stroke="#1B0F30" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M104,52 C112,35 122,28 126,18" stroke="#1B0F30" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="74" cy="18" r="2.5" fill="#1B0F30"/>
        <circle cx="126" cy="18" r="2.5" fill="#1B0F30"/>
        <ellipse id="body" class="zone" cx="100" cy="90" rx="7" ry="32" fill="${c.body || '#1B0F30'}" stroke="transparent" stroke-width="8" onclick="paintZone('body')"/>
        <circle cx="100" cy="55" r="7" fill="#1B0F30"/>
      </svg>`;
  }

  window.butterflySvg = butterflySvg;
  window.ButterflySvgView = {
    butterflySvg,
  };
})();
