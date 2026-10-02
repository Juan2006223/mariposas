// Componente de Onboarding Infantil Lúdico (< 150 líneas)
const AVATARES_INFANTILES = [
  { id: 'mariposa_sol', label: 'Sol radiante', icon: '🦋', color: 'linear-gradient(135deg, #FFC857, #D946B5)' },
  { id: 'mariposa_rio', label: 'Río azul', icon: '✨', color: 'linear-gradient(135deg, #5B6FE8, #9B4DFF)' },
  { id: 'oruga_valiente', label: 'Oruguita', icon: '🐛', color: 'linear-gradient(135deg, #4FB286, #FFC857)' },
  { id: 'colibri_flor', label: 'Colibrí', icon: '🌸', color: 'linear-gradient(135deg, #D946B5, #9B4DFF)' },
  { id: 'canelo_amigo', label: 'Canelo', icon: '🐶', color: 'linear-gradient(135deg, #B0793F, #FFC857)' }
];

let avatarSeleccionado = AVATARES_INFANTILES[0].id;
let edadSeleccionada = 7;
let nombreTemporal = '';
let apellidoTemporal = '';

function renderOnboardingModal() {
  const container = document.getElementById('nameGate');
  if (!container) return;

  container.innerHTML = `
    <div style="width:min(430px,94%); display:flex; align-items:center; justify-content:space-between; gap:10px;">
      <div style="font-size:2.6rem; animation: guideFloat 2s infinite;">🦋</div>
      <div style="flex:1; text-align:left;">
        <div class="station-title" style="font-size:1.2rem; margin:0;">Crea tu explorador/a</div>
        <div class="station-sub" style="margin:0; font-size:.86rem;">Como en un juego: datos, avatar y edad.</div>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; width:min(430px,94%); margin:2px 0 4px;">
      ${['1 Datos','2 Avatar','3 Edad'].map(step => `
        <div style="border:1px solid var(--line); background:var(--card2); color:var(--ink); border-radius:12px; padding:7px 6px; font-weight:900; font-size:.72rem;">${step}</div>
      `).join('')}
    </div>

    <div style="display:grid; gap:9px; width:min(420px,92%);">
      <input class="input-field" id="childNameInput" placeholder="Primer nombre" value="${nombreTemporal}" oninput="nombreTemporal=this.value" style="width:100%; max-width:none; text-align:center; font-weight:800; font-size:1rem; border-color:var(--violeta);" />
      <input class="input-field" id="childLastNameInput" placeholder="Apellido" value="${apellidoTemporal}" oninput="apellidoTemporal=this.value" style="width:100%; max-width:none; text-align:center; font-weight:800; font-size:1rem; border-color:var(--violeta);" />
    </div>

    <div class="station-sub" style="margin: 4px 0 0; font-weight:800;">Toca tu avatar</div>
    <div style="display:grid; grid-template-columns:repeat(5,58px); justify-content:center; gap:9px; margin-bottom:4px;">
      ${AVATARES_INFANTILES.map(av => `
        <div id="av_${av.id}" onclick="seleccionarAvatar('${av.id}')" 
             title="${av.label}"
             style="width:58px; height:58px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.75rem; cursor:pointer; background:${av.color}; box-shadow:0 8px 18px rgba(0,0,0,0.25); border: 3px solid ${avatarSeleccionado === av.id ? '#fff' : 'transparent'}; transition: transform 0.2s ease;">
          ${av.icon}
        </div>
      `).join('')}
    </div>

    <div class="station-sub" style="margin: 0; font-weight:800;">Toca tu edad</div>
    <div id="ageButtonGrid" style="display:grid; grid-template-columns:repeat(7,44px); justify-content:center; gap:7px; margin-bottom:2px;">
      ${[6,7,8,9,10,11,12].map(age => `
        <button type="button" onclick="seleccionarEdad(${age})"
          style="height:44px; border-radius:14px; border:1px solid var(--line); background:${edadSeleccionada === age ? 'linear-gradient(135deg,var(--sol),var(--rosa))' : 'var(--card2)'}; color:${edadSeleccionada === age ? '#2a1748' : 'var(--ink)'}; font-weight:900; cursor:pointer;">
          ${age}
        </button>
      `).join('')}
    </div>
    <div id="onboardingError" style="min-height:18px; color:var(--sol); font-size:.78rem; font-weight:800;"></div>

    <button class="primary-btn" onclick="confirmarOnboardingInfantil()" style="position:sticky; bottom:0; width:min(420px,92%); max-width:none; margin-top:auto; padding:14px; font-size:1.05rem; z-index:2; box-shadow:0 10px 24px rgba(0,0,0,.28);">
      Guardar y comenzar
    </button>
  `;
}

function seleccionarAvatar(id) {
  avatarSeleccionado = id;
  AVATARES_INFANTILES.forEach(av => {
    const el = document.getElementById(`av_${av.id}`);
    if (el) el.style.border = av.id === id ? '3px solid #fff' : '3px solid transparent';
    if (el) el.style.transform = av.id === id ? 'translateY(-3px) scale(1.04)' : 'none';
  });
}

function seleccionarEdad(age) {
  const input = document.getElementById('childNameInput');
  const lastInput = document.getElementById('childLastNameInput');
  if (input) nombreTemporal = input.value;
  if (lastInput) apellidoTemporal = lastInput.value;
  edadSeleccionada = age;
  renderOnboardingModal();
}

function actualizarEdadSlider(val) {
  edadSeleccionada = parseInt(val);
  const badge = document.getElementById('edadBadge');
  if (badge) badge.innerText = `${edadSeleccionada} años (${edadSeleccionada <= 8 ? 'Grupo 6-8' : 'Grupo 9-12'})`;
}

function cambiarEdad(delta) {
  edadSeleccionada = Math.min(12, Math.max(6, edadSeleccionada + delta));
  const slider = document.getElementById('childAgeSlider');
  if (slider) slider.value = edadSeleccionada;
  actualizarEdadSlider(edadSeleccionada);
}

async function confirmarOnboardingInfantil() {
  const input = document.getElementById('childNameInput');
  const lastInput = document.getElementById('childLastNameInput');
  const nombre = input ? input.value.trim() : '';
  const apellido = lastInput ? lastInput.value.trim() : '';
  const error = document.getElementById('onboardingError');
  if (!nombre || nombre.length < 2 || !apellido || apellido.length < 2) {
    if (error) error.innerText = 'Escribe primer nombre y apellido.';
    if (input) input.focus();
    return;
  }

  const grupo = edadSeleccionada <= 8 ? '6-8' : '9-12';
  nombreTemporal = nombre;
  apellidoTemporal = apellido;
  userName = nombre;
  userLastName = apellido;
  userAvatar = AVATARES_INFANTILES.find(av => av.id === avatarSeleccionado)?.icon || '🦋';
  userAge = edadSeleccionada;
  window.userGroup = grupo;
  window.userAvatar = avatarSeleccionado;
  window.userAge = edadSeleccionada;

  // Configurar grupo y ocultar bienvenida de inmediato; el backend guarda en segundo plano.
  if (typeof setGroup === 'function') setGroup(grupo);
  const topSub = document.querySelector('.top-sub');
  if (topSub) topSub.innerText = `${userAvatar} ${nombre} ${apellido} — ${edadSeleccionada} años`;
  const gate = document.getElementById('nameGate');
  if (gate) gate.style.display = 'none';
  if (typeof render === 'function') render();

  try {
    const res = await ApiClient.registrarPerfil({
      nombre: `${nombre} ${apellido}`,
      avatar: userAvatar,
      edad: edadSeleccionada
    });
    if (res && res.data) window.userId = res.data.id;
  } catch (e) {
    console.warn('Registro local de niño activo');
  }
}
