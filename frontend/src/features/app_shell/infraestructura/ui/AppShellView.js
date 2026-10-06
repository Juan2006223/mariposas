// frontend/src/features/app_shell/infraestructura/ui/AppShellView.js
function station1_68(){
  return `
    <div class="station-title">El Baúl de los Secretos de Canelo</div>
    <div class="station-sub">Toca el baúl y descubre objetos con historias del territorio.</div>
    <div style="text-align:center; margin:8px 0;"><span class="tap-hint">Dame clic para abrir</span></div>
    <div class="baul-zone">
      <svg class="baul clickable-glow" id="baulSvg" width="200" height="150" viewBox="0 0 120 90" onclick="openBaul()">
        <rect x="6" y="30" width="108" height="54" rx="10" fill="#B0793F"/>
        <rect x="6" y="30" width="108" height="14" rx="7" fill="#C99657"/>
        <rect x="52" y="40" width="16" height="10" rx="3" fill="#FFC857"/>
        <path d="M6 30 Q60 4 114 30" fill="none" stroke="#7A5023" stroke-width="6"/>
      </svg>
      <div class="bubbles" id="bubbles"></div>
      <div class="relato-card" id="relatoCard"></div>
      <div id="cierreBlock" style="display:none; text-align:center;">
        <div class="station-sub" style="margin-top:10px;">¿Cómo te sentiste al escuchar la historia?</div>
        <div class="caritas" id="caritas">
          ${['carita-feliz','carita-amor','carita-asombro','carita-duda','carita-triste'].map(e=>`<div class="carita" onclick="selCarita(this)">${miIcon(e)}</div>`).join('')}
        </div>
        <div id="continueBlock1_68" style="display:none; margin-top:14px;">
          <button class="primary-btn" onclick="setStation(2)">Completar y continuar ${miIcon('flecha')}</button>
        </div>
      </div>
    </div>
  `;
}
function station1_912(){
  hotspotsSeen = new Set();
  return `
    <div class="station-title">Cuando la Mariposa comenzó a batir sus alas</div>
    <div class="station-sub">Hace muchos años, este lugar era muy diferente. Algunas familias llegaron con sus sueños, sus manos y muchas ganas de construir un hogar. ¿Quieres descubrir cómo comenzó esta historia?</div>

    <div class="scene-wrap">
      <img src="${CONOZCO_BG_IMG}" class="scene-img" alt="Paisaje de montañas de La Mariposa" />
      <button class="hotspot" style="top:68%; left:10%;" onclick="openHotspot(0)">${miIcon('gota')}</button>
      <button class="hotspot" style="top:58%; left:30%;" onclick="openHotspot(1)">${miIcon('fuego')}</button>
      <button class="hotspot" style="top:62%; left:52%;" onclick="openHotspot(2)">${miIcon('casa')}</button>
      <button class="hotspot" style="top:72%; left:72%;" onclick="openHotspot(3)">${miIcon('vecinos')}</button>
      <button class="hotspot" style="top:16%; left:88%;" onclick="openHotspot(4)">${miIcon('cometa')}</button>
      <div class="scene-guide">${miIcon('mariposa')}</div>
    </div>
    <div class="modal-panel" id="hotspotPanel">Toca los íconos sobre la ilustración para descubrir partes de la historia.</div>

    <button class="primary-btn" style="margin-top:16px;" onclick="toggleNarration()">
      <span id="playIcon">${miIcon('play')}</span>&nbsp; ESCUCHAR LA HISTORIA
    </button>
    <div class="station-sub" style="text-align:center; margin-top:2px;">Alicia Herrera — Memoria de La Mariposa</div>

    <div id="reflectionBlock" style="display:none; margin-top:18px;">
      <div class="station-sub" style="font-weight:700; color:var(--ink); margin-bottom:8px;">¿Te imaginas cómo era vivir aquí?</div>
      <div class="reflect-options">
        <div class="reflect-opt" onclick="selReflectionConozco(this)">Con pocos servicios</div>
        <div class="reflect-opt" onclick="selReflectionConozco(this)">Con mucha naturaleza</div>
        <div class="reflect-opt" onclick="selReflectionConozco(this)">Con una comunidad unida</div>
      </div>
      <div id="continueBlockConozco912" style="display:none; margin-top:14px;">
        <button class="primary-btn" onclick="setStation(2)">DESCUBRIR MÁS ${miIcon('flecha')}</button>
      </div>
    </div>
  `;
}
