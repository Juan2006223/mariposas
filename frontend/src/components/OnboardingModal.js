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
    <div style="font-size:3.5rem; animation: guideFloat 2s infinite;">🦋</div>
    <div class="station-title" style="font-size:1.35rem; margin-top:2px;">¡Bienvenido a Mariposa Viva!</div>
    <div class="station-sub" style="margin-bottom:8px;">Escribe tu nombre y elige tu avatar para comenzar el viaje:</div>
    
    <input class="input-field" id="childNameInput" placeholder="¿Cómo te llamas?" style="text-align:center; font-weight:700; font-size:1rem; border-color:var(--violeta);" />
    
    <div class="station-sub" style="margin: 10px 0 4px; font-weight:700;">Elige tu avatar compañero:</div>
    <div style="display:flex; justify-content:center; gap:8px; margin-bottom:10px;">
      ${AVATARES_INFANTILES.map(av => `
        <div id="av_${av.id}" onclick="seleccionarAvatar('${av.id}')" 
             style="width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.6rem; cursor:pointer; background:${av.color}; box-shadow:0 4px 10px rgba(0,0,0,0.3); border: 3px solid ${avatarSeleccionado === av.id ? '#fff' : 'transparent'}; transition: transform 0.2s ease;">
          ${av.icon}
        </div>
      `).join('')}
    </div>

    <div class="station-sub" style="margin: 6px 0 2px; font-weight:700;">¿Cuántos años tienes? (<span id="edadBadge">${edadSeleccionada} años</span>)</div>
    <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:8px;">
      <button type="button" onclick="cambiarEdad(-1)" style="width:36px; height:36px; border-radius:50%; border:none; background:var(--card2); color:var(--ink); font-size:1.3rem; cursor:pointer; border:1px solid var(--line);">-</button>
      <input type="range" id="childAgeSlider" min="6" max="12" value="${edadSeleccionada}" oninput="actualizarEdadSlider(this.value)" style="accent-color:var(--violeta); width:150px;" />
      <button type="button" onclick="cambiarEdad(1)" style="width:36px; height:36px; border-radius:50%; border:none; background:var(--card2); color:var(--ink); font-size:1.3rem; cursor:pointer; border:1px solid var(--line);">+</button>
    </div>

    <button class="primary-btn" onclick="confirmarOnboardingInfantil()" style="margin-top:10px; font-size:1.05rem;">
      ¡Comenzar mi viaje! ✨
    </button>
  `;
}

function seleccionarAvatar(id) {
  avatarSeleccionado = id;
  AVATARES_INFANTILES.forEach(av => {
    const el = document.getElementById(`av_${av.id}`);
    if (el) el.style.border = av.id === id ? '3px solid #fff' : '3px solid transparent';
  });
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
  const nombre = input ? input.value.trim() : '';
  if (!nombre || nombre.length < 2) {
    alert('Por favor escribe tu nombre para comenzar la aventura 🦋');
    if (input) input.focus();
    return;
  }

  const grupo = edadSeleccionada <= 8 ? '6-8' : '9-12';
  window.userName = nombre;
  window.userGroup = grupo;
  window.userAvatar = avatarSeleccionado;
  window.userAge = edadSeleccionada;

  // Sincronizar en Backend PostgreSQL
  try {
    const res = await ApiClient.registrarPerfil({
      nombre,
      avatar: avatarSeleccionado,
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
  const gate = document.getElementById('nameGate');
  if (gate) gate.style.display = 'none';

  if (typeof render === 'function') render();
}
