// frontend/src/features/app_shell/infraestructura/ui/AppShellView.js
function station1_68(){
  return `
    <div class="station-title">El BaÃºl de los Secretos de Canelo</div>
    <div class="station-sub">Toca el baÃºl y descubre objetos con historias del territorio.</div>
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
        <div class="station-sub" style="margin-top:10px;">Â¿CÃ³mo te sentiste al escuchar la historia?</div>
        <div class="caritas" id="caritas">
          ${['ðŸ˜Š','ðŸ¥°','ðŸ˜®','ðŸ¤”','ðŸ˜¢'].map(e=>`<div class="carita" onclick="selCarita(this)">${e}</div>`).join('')}
        </div>
        <div id="continueBlock1_68" style="display:none; margin-top:14px;">
          <button class="primary-btn" onclick="setStation(2)">Completar y continuar âžœ</button>
        </div>
      </div>
    </div>
  `;
}
function station1_912(){
  hotspotsSeen = new Set();
  return `
    <div class="station-title">Cuando la Mariposa comenzÃ³ a batir sus alas</div>
    <div class="station-sub">Hace muchos aÃ±os, este lugar era muy diferente. Algunas familias llegaron con sus sueÃ±os, sus manos y muchas ganas de construir un hogar. Â¿Quieres descubrir cÃ³mo comenzÃ³ esta historia?</div>

    <div class="scene-wrap">
      <img src="${CONOZCO_BG_IMG}" class="scene-img" alt="Paisaje de montaÃ±as de La Mariposa" />
      <button class="hotspot" style="top:68%; left:10%;" onclick="openHotspot(0)">ðŸ’§</button>
      <button class="hotspot" style="top:58%; left:30%;" onclick="openHotspot(1)">ðŸ”¥</button>
      <button class="hotspot" style="top:62%; left:52%;" onclick="openHotspot(2)">ðŸ </button>
      <button class="hotspot" style="top:72%; left:72%;" onclick="openHotspot(3)">ðŸ‘¥</button>
      <button class="hotspot" style="top:16%; left:88%;" onclick="openHotspot(4)">ðŸª</button>
      <div class="scene-guide">ðŸ¦‹</div>
    </div>
    <div class="modal-panel" id="hotspotPanel">Toca los Ã­conos sobre la ilustraciÃ³n para descubrir partes de la historia.</div>

    <button class="primary-btn" style="margin-top:16px;" onclick="toggleNarration()">
      <span id="playIcon">â–¶</span>&nbsp; ESCUCHAR LA HISTORIA
    </button>
    <div class="station-sub" style="text-align:center; margin-top:2px;">Alicia Herrera â€” Memoria de La Mariposa</div>

    <div id="reflectionBlock" style="display:none; margin-top:18px;">
      <div class="station-sub" style="font-weight:700; color:var(--ink); margin-bottom:8px;">Â¿Te imaginas cÃ³mo era vivir aquÃ­?</div>
      <div class="reflect-options">
        <div class="reflect-opt" onclick="selReflectionConozco(this)">Con pocos servicios</div>
        <div class="reflect-opt" onclick="selReflectionConozco(this)">Con mucha naturaleza</div>
        <div class="reflect-opt" onclick="selReflectionConozco(this)">Con una comunidad unida</div>
      </div>
      <div id="continueBlockConozco912" style="display:none; margin-top:14px;">
        <button class="primary-btn" onclick="setStation(2)">DESCUBRIR MÃS âžœ</button>
      </div>
    </div>
  `;
}
