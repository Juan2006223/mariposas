// frontend/src/features/app_shell/aplicacion/NavigationActions.js
function pickAvatar(el, avatar){
  userAvatar = avatar;
  document.querySelectorAll('.avatar-btn').forEach(b=>b.classList.remove('sel'));
  el.classList.add('sel');
}
function pickAge(el, age){
  userAge = age;
  document.querySelectorAll('.age-chip').forEach(b=>b.classList.remove('sel'));
  el.classList.add('sel');
}
function submitName(){
  const val = document.getElementById('nameInput').value.trim();
  const last = document.getElementById('lastNameInput').value.trim();
  const error = document.getElementById('nameGateError');
  if(!val || !last){
    if(error) error.innerText = 'Escribe primer nombre y apellido.';
    return;
  }
  userName = val;
  userLastName = last;
  document.getElementById('nameGate').style.display = 'none';
  const greet = document.getElementById('ageGateGreeting');
  if(greet) greet.innerText = `Â¡Hola, ${userAvatar} ${userName}!`;
  document.getElementById('ageGate').style.display = 'flex';
}
/* Elegida la edad, se entra reciÃ©n a la app en el grupo correspondiente */
async function chooseGroup(){
  const error = document.getElementById('ageGateError');
  if(!userAge){
    if(error) error.innerText = 'Elige tu edad para continuar.';
    return;
  }
  const g = userAge <= 8 ? '6-8' : '9-12';
  group = g;
  document.getElementById('btnG1').classList.toggle('active', g==='6-8');
  document.getElementById('btnG2').classList.toggle('active', g==='9-12');
  document.getElementById('ageGate').style.display = 'none';
  document.querySelector('.top-sub').innerText = `${userAvatar} ${userName} ${userLastName} â€” ${userAge} aÃ±os`;
  render();
  if(window.ApiClient && typeof ApiClient.registrarPerfil === 'function'){
    try {
      window.profileSavePromise = ApiClient.registrarPerfil({
        nombre: `${userName} ${userLastName}`,
        avatar: userAvatar,
        edad: userAge,
        fechaNacimiento: ''
      });
      const resp = await window.profileSavePromise;
      if(resp && resp.success && resp.data) window.userId = resp.data.id;
      else showPersistenceNotice((resp && resp.error) || 'No se pudo guardar el perfil. Intenta de nuevo.', true);
    } catch(e) {
      showPersistenceNotice('No se pudo guardar el perfil. Intenta de nuevo.', true);
    }
  }
}

/* Cierra el turno del niÃ±o/a actual: lo ya creado queda guardado en el Mural,
   y la app vuelve a pedir el nombre para que el prÃ³ximo niÃ±o/a empiece su turno. */
function finishSession(){
  const ok = confirm('Esto cierra el turno actual y vuelve al registro para otro niÃ±o/a. Â¿Quieres continuar?');
  if(!ok) return;
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  stopCharacterAudio();
  stopConozcoAudio();
  stopPiensoAudio();
  clearFlyingFireflies();
  micBusy = false;
  // Reiniciar progreso de cada estaciÃ³n (las mariposas/voces YA guardadas no se tocan)
  group = '6-8';
  station = 1;
  zonesPainted = new Set();
  zoneColorMap = {...defaultZoneColors68};
  openedCount = 0;
  listenedCount = 0;
  sessionWords = [];
  placesVisited = new Set();
  mapVisited = new Set();
  mapFavIdx = null;
  exploroStage = 'map';
  favoritePlaceIdx = null;
  pienso = { level:null, unlocked:new Set([1]), completed:new Set(), badges:[] };
  window._creaStep = 0;
  window._creaImg = null;
  window._creaName = null; window._creaQuality = null; window._creaCategory = null; window._creaMsg = null; window._creaRotate = 0;

  document.getElementById('btnG1').classList.add('active');
  document.getElementById('btnG2').classList.remove('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', Number(t.dataset.st)===1));

  userName = '';
  userLastName = '';
  userAge = null;
  userAvatar = 'ðŸ¦‹';
  window.userId = null;
  const nameInput = document.getElementById('nameInput');
  if(nameInput) nameInput.value = '';
  const lastNameInput = document.getElementById('lastNameInput');
  if(lastNameInput) lastNameInput.value = '';
  document.querySelectorAll('.avatar-btn').forEach((b,i)=>b.classList.toggle('sel', i===0));
  document.querySelectorAll('.age-chip').forEach(b=>b.classList.remove('sel'));
  document.querySelector('.top-sub').innerText = '';
  if(typeof nombreTemporal !== 'undefined') nombreTemporal = '';
  if(typeof apellidoTemporal !== 'undefined') apellidoTemporal = '';
  document.getElementById('nameGate').style.display = 'flex';
  document.getElementById('ageGate').style.display = 'none';
  if(typeof renderOnboardingModal === 'function') renderOnboardingModal();
  closeLightbox();
  render();
}

function setGroup(g){
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  stopCharacterAudio();
  clearFlyingFireflies();
  micBusy = false;
  group = g;
  document.getElementById('btnG1').classList.toggle('active', g==='6-8');
  document.getElementById('btnG2').classList.toggle('active', g==='9-12');
  render();
}
function setStation(s){
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  stopCharacterAudio();
  stopConozcoAudio();
  stopPiensoAudio();
  clearFlyingFireflies();
  micBusy = false;
  station = s;
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', Number(t.dataset.st)===s));
  render();
}

function render(){
  const el = document.getElementById('screen');
  if(station===1) el.innerHTML = group==='6-8' ? station1_68() : station1_912();
  if(station===2) el.innerHTML = group==='6-8' ? station2_68() : station2_912();
  if(station===3) el.innerHTML = group==='6-8' ? station3_68() : station3_912();
  if(station===4) el.innerHTML = group==='6-8' ? station4_68() : station4_912();
  if(station===5) el.innerHTML = muralScreen();
  if(station===6) el.innerHTML = station6();
  if(station===2 && group==='9-12') initCanvas();
  const finishBar = document.getElementById('finishBar');
  if(finishBar) finishBar.classList.toggle('show', station >= 5);
}

