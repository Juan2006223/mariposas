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

function renderOnboardingModal() {
  const container = document.getElementById('nameGate');
  if (!container) return;

  container.innerHTML = `
    <div style="font-size:3.4rem; animation: guideFloat 2s infinite;">🦋</div>
    <div class="station-title" style="font-size:1.35rem; margin-top:2px;">Crea tu explorador/a</div>
    <div class="station-sub" style="margin-bottom:8px;">Escribe tus datos y elige quién te acompaña.</div>

    <div style="display:grid; gap:9px; width:min(420px,92%);">
      <input class="input-field" id="childNameInput" placeholder="Primer nombre" style="width:100%; max-width:none; text-align:center; font-weight:800; font-size:1rem; border-color:var(--violeta);" />
      <input class="input-field" id="childLastNameInput" placeholder="Apellido" style="width:100%; max-width:none; text-align:center; font-weight:800; font-size:1rem; border-color:var(--violeta);" />
    </div>

    <div class="station-sub" style="margin: 10px 0 4px; font-weight:800;">Toca tu avatar</div>
    <div style="display:grid; grid-template-columns:repeat(5,52px); justify-content:center; gap:10px; margin-bottom:10px;">
      ${AVATARES_INFANTILES.map(av => `
        <div id="av_${av.id}" onclick="seleccionarAvatar('${av.id}')" 
             title="${av.label}"
             style="width:52px; height:52px; border-radius:18px; display:flex; align-items:center; justify-content:center; font-size:1.65rem; cursor:pointer; background:${av.color}; box-shadow:0 8px 18px rgba(0,0,0,0.25); border: 3px solid ${avatarSeleccionado === av.id ? '#fff' : 'transparent'}; transition: transform 0.2s ease;">
          ${av.icon}
        </div>
      `).join('')}
    </div>

    <div class="station-sub" style="margin: 6px 0 2px; font-weight:800;">Toca tu edad</div>
    <div id="ageButtonGrid" style="display:grid; grid-template-columns:repeat(4,58px); justify-content:center; gap:8px; margin-bottom:8px;">
      ${[6,7,8,9,10,11,12].map(age => `
        <button type="button" onclick="seleccionarEdad(${age})"
          style="height:46px; border-radius:16px; border:1px solid var(--line); background:${edadSeleccionada === age ? 'linear-gradient(135deg,var(--sol),var(--rosa))' : 'var(--card2)'}; color:${edadSeleccionada === age ? '#2a1748' : 'var(--ink)'}; font-weight:900; cursor:pointer;">
          ${age}
        </button>
      `).join('')}
    </div>
    <div id="onboardingError" style="min-height:18px; color:var(--sol); font-size:.78rem; font-weight:800;"></div>

    <button class="primary-btn" onclick="confirmarOnboardingInfantil()" style="margin-top:10px; font-size:1.05rem;">
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
  userName = nombre;
  userLastName = apellido;
  userAvatar = AVATARES_INFANTILES.find(av => av.id === avatarSeleccionado)?.icon || '🦋';
  userAge = edadSeleccionada;
  window.userGroup = grupo;
  window.userAvatar = avatarSeleccionado;
  window.userAge = edadSeleccionada;

  // Sincronizar en Backend PostgreSQL
  try {
    const res = await ApiClient.registrarPerfil({
      nombre: `${nombre} ${apellido}`,
      avatar: userAvatar,
      edad: edadSeleccionada
    });
    if (res && res.data) {
      window.userId = res.data.id;
    }
  } catch (e) {
    console.warn('Registro local de niño activo');
  }

  // Configurar grupo y ocultar bienvenida
  if (typeof setGroup === 'function') setGroup(grupo);
  const topSub = document.querySelector('.top-sub');
  if (topSub) topSub.innerText = `${userAvatar} ${nombre} ${apellido} — ${edadSeleccionada} años`;
  const gate = document.getElementById('nameGate');
  if (gate) gate.style.display = 'none';

  if (typeof render === 'function') render();
}
