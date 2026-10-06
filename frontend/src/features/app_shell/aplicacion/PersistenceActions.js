// frontend/src/features/app_shell/aplicacion/PersistenceActions.js
async function ensureUserProfileForSave(){
  if(window.userId) return true;
  const pending = window.profileSavePromise ? await window.profileSavePromise : null;
  if(!window.userId && pending && pending.success && pending.data) window.userId = pending.data.id;
  if(window.userId) return true;
  if(!window.ApiClient || typeof ApiClient.registrarPerfil !== 'function') return false;
  const first = typeof userName !== 'undefined' ? userName : '';
  const last = typeof userLastName !== 'undefined' ? userLastName : '';
  const age = typeof userAge !== 'undefined' ? userAge : window.userAge;
  if(!first || !last || !age) return false;
  window.profileSavePromise = ApiClient.registrarPerfil({
    nombre: `${first} ${last}`.trim(),
    avatar: typeof userAvatar !== 'undefined' ? userAvatar : (window.userAvatar || 'mariposa'),
    edad: age,
    fechaNacimiento: ''
  });
  const created = await window.profileSavePromise;
  if(created && created.success && created.data) window.userId = created.data.id;
  return Boolean(window.userId);
}

async function saveMuralArtifact(tipo, contenido){
  if(!window.ApiClient || typeof ApiClient.guardarArtefactoMural !== 'function') return {success:false, error:'API no disponible.'};
  const hasProfile = await ensureUserProfileForSave();
  if(!hasProfile) {
    showPersistenceNotice('Espera a que el perfil termine de guardarse antes de crear.', true);
    return {success:false};
  }
  const result = await ApiClient.guardarArtefactoMural({
    ninoId: window.userId,
    tipo,
    autor: `${userName || 'Anónimo'} ${userLastName || ''}`.trim(),
    contenido
  });
  if(!result || !result.success) showPersistenceNotice((result && result.error) || 'La creación no llegó a Neon. Intenta guardarla de nuevo.', true);
  return result;
}

function showPersistenceNotice(message, isError = false){
  let notice = document.getElementById('persistenceNotice');
  if(!notice){
    notice = document.createElement('div');
    notice.id = 'persistenceNotice';
    notice.setAttribute('role', 'status');
    notice.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:10000;max-width:min(520px,90vw);padding:12px 16px;border-radius:10px;font-weight:800;text-align:center;';
    document.body.appendChild(notice);
  }
  notice.textContent = message;
  notice.style.background = isError ? '#8f285f' : '#244f42';
  notice.style.color = '#fff';
  notice.hidden = false;
  clearTimeout(window.persistenceNoticeTimer);
  window.persistenceNoticeTimer = setTimeout(() => { notice.hidden = true; }, 6500);
}
async function hydrateMuralFromApi(){
  if(!window.ApiClient || typeof ApiClient.listarMural !== 'function') return;
  const resp = await ApiClient.listarMural();
  if(!resp || !resp.success || !Array.isArray(resp.data)) return;
  const readContent = item => {
    if(typeof item.contenido !== 'string') return item.contenido || {};
    try { return JSON.parse(item.contenido); } catch(e) { return {}; }
  };
  const artifacts = resp.data.map(item => ({...item, parsed:readContent(item)}));
  muralButterflies = artifacts.filter(a => a.tipo === 'mariposa' || a.tipo === 'dibujo').slice(0, 60).map(a => {
    const c = a.parsed;
    return c.src
      ? {type:'image', src:c.src, name:a.autor, butterflyName:c.butterflyName, quality:c.quality, category:c.category, message:c.message}
      : {type:'zones', colors:c.colors || c, name:a.autor};
  });
  muralVoices = artifacts.filter(a => a.tipo === 'voz').map(a => a.parsed);
  muralFootprints = artifacts.filter(a => a.tipo === 'huella').map(a => a.parsed);
  muralReflections = artifacts.filter(a => a.tipo === 'reflexion').map(a => a.parsed);
  const gate = document.getElementById('nameGate');
  if(gate && gate.style.display !== 'none' && typeof renderOnboardingModal === 'function') renderOnboardingModal();
  if(station === 5) render();
}
