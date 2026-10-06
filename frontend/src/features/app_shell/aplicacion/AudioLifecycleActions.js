// frontend/src/features/app_shell/aplicacion/AudioLifecycleActions.js
function stopCharacterAudio(){
  const audio = document.getElementById('charAudio');
  if(audio){ audio.pause(); audio.currentTime = 0; }
}
/* Pausa o reanuda la narración en curso (audio real o síntesis de voz), según el personaje activo */
/* Elimina cualquier luciérnaga que haya quedado "en vuelo" si el niño cambia de pantalla a mitad de la animación */
function clearFlyingFireflies(){
  document.querySelectorAll('.flying-firefly').forEach(f=>f.remove());
}
/* Narración por voz (Web Speech API) con tono/velocidad tipo "personaje de caricatura" para cada relato */
function stopConozcoAudio(){
  const audio = document.getElementById('conozcoAudio');
  if(audio){ audio.pause(); }
  conozcoPlaying = false;
}
function stopPiensoAudio(){
  const audio = document.getElementById('piensoAudio');
  if(audio){ audio.pause(); }
  piensoAudioPlaying = false;
}
/* Efecto de sonido corto y suave para CUALQUIER botón/elemento interactivo de la app */
let _clickAudioCtx = null;
function playClickSound(){
  try{
    if(!_clickAudioCtx) _clickAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(_clickAudioCtx.state === 'suspended') _clickAudioCtx.resume();
    const o = _clickAudioCtx.createOscillator();
    const g = _clickAudioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(680, _clickAudioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(420, _clickAudioCtx.currentTime+0.08);
    g.gain.setValueAtTime(0.14, _clickAudioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, _clickAudioCtx.currentTime+0.09);
    o.connect(g).connect(_clickAudioCtx.destination);
    o.start();
    o.stop(_clickAudioCtx.currentTime+0.1);
  }catch(e){}
}
/* Se activa con cualquier click sobre un botón o elemento interactivo (todos usan atributo onclick) */
document.addEventListener('click', function(e){
  if(e.target.closest('[onclick]')) playClickSound();
}, true);
/* ---------------- ESTACIÓN 4 ---------------- */
/* ---------------- MURAL — solo mariposas y voces/audios ---------------- */
