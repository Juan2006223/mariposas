// frontend/src/features/app_shell/aplicacion/Station1Actions.js
let openedCount = 0;
function openBaul(){
  const b = document.getElementById('bubbles');
  if(b.dataset.opened) return;
  b.dataset.opened = '1';
  b.innerHTML = objetos.map((o,i)=>`<button class="bubble" style="background:${o.color}" data-i="${i}" onclick="popBubble(this,${i})">${o.ico}</button>`).join('');
  setTimeout(()=>{ document.querySelectorAll('.bubble').forEach((el,i)=>setTimeout(()=>el.classList.add('show'), i*90)); }, 30);
}
function popBubble(el,i){
  if(el.classList.contains('popped')) return;
  el.classList.add('popped');
  openedCount++;
  const o = objetos[i];
  const card = document.getElementById('relatoCard');
  card.classList.add('show');
  card.innerHTML = `<strong>${o.nombre}</strong> <span style="color:var(--sol); font-size:0.72rem;">â€” voz de ${o.voz} ${o.audioSrc ? 'ðŸŽ™ï¸ (grabaciÃ³n real)' : 'ðŸŽ¬'}</span>
    <div style="font-style:italic; color:var(--violeta-suave); margin:4px 0;">"${o.saludo}"</div>
    ${o.relato}
    <div style="margin-top:10px; text-align:center;">
      <button class="tool-btn" id="pauseBtn" onclick="togglePauseCharacter(${i})">â¸ Pausar</button>
      <button class="tool-btn" onclick="speakCharacter(${i})">ðŸ”Š Escuchar de nuevo</button>
    </div>`;
  speakCharacter(i);
}
/* Narra primero el saludo del personaje y luego su relato. Si el personaje tiene un audio real grabado, se reproduce ese en vez de la voz sintÃ©tica. */
let listenedCount = 0;
function speakCharacter(i){
  const o = objetos[i];
  const btn = document.getElementById('pauseBtn');
  if(btn) btn.textContent = 'â¸ Pausar';
  if(o.audioSrc){
    playCharacterAudio(o.audioSrc);
  } else {
    speakTextWithCallback(o.saludo + ' ... ' + o.relato, o.pitch, o.rate, onAudioFinished);
  }
}
function playCharacterAudio(src){
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  let audio = document.getElementById('charAudio');
  if(!audio){
    audio = document.createElement('audio');
    audio.id = 'charAudio';
    audio.style.display = 'none';
    document.body.appendChild(audio);
  }
  audio.pause();
  audio.currentTime = 0;
  audio.src = src;
  audio.onended = onAudioFinished;
  audio.play().catch(()=>{});
}
function togglePauseCharacter(i){
  const o = objetos[i];
  const btn = document.getElementById('pauseBtn');
  if(o.audioSrc){
    const audio = document.getElementById('charAudio');
    if(!audio) return;
    if(audio.paused){
      audio.play().catch(()=>{});
      if(btn) btn.textContent = 'â¸ Pausar';
    } else {
      audio.pause();
      if(btn) btn.textContent = 'â–¶ Reanudar';
    }
  } else {
    if(!('speechSynthesis' in window)) return;
    if(window.speechSynthesis.speaking && !window.speechSynthesis.paused){
      window.speechSynthesis.pause();
      if(btn) btn.textContent = 'â–¶ Reanudar';
    } else if(window.speechSynthesis.paused){
      window.speechSynthesis.resume();
      if(btn) btn.textContent = 'â¸ Pausar';
    }
  }
}
/* Se llama cuando termina de reproducirse por completo la narraciÃ³n de un objeto del baÃºl; solo entonces cuenta como "escuchado" */
function onAudioFinished(){
  listenedCount++;
  const btn = document.getElementById('pauseBtn');
  if(btn) btn.textContent = 'â¸ Pausar';
  if(listenedCount>=2){
    const cierre = document.getElementById('cierreBlock');
    if(cierre) cierre.style.display='block';
  }
}
function speakText(text, pitch, rate){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'es-ES';
  utter.rate = rate || 1.05;
  utter.pitch = pitch != null ? pitch : 1.4;
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('es'));
  if(esVoice) utter.voice = esVoice;
  window.speechSynthesis.speak(utter);
}
/* Igual que speakText, pero ejecuta un callback cuando la narraciÃ³n termina por completo (usada en el baÃºl para saber cuÃ¡ndo mostrar el cierre) */
function speakTextWithCallback(text, pitch, rate, cb){
  if(!('speechSynthesis' in window)){ if(cb) cb(); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'es-ES';
  utter.rate = rate || 1.05;
  utter.pitch = pitch != null ? pitch : 1.4;
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('es'));
  if(esVoice) utter.voice = esVoice;
  if(cb) utter.onend = cb;
  window.speechSynthesis.speak(utter);
}
if('speechSynthesis' in window){
  window.speechSynthesis.onvoiceschanged = () => {};
}
function selCarita(el){
  document.querySelectorAll('.carita').forEach(c=>c.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('continueBlock1_68').style.display='block';
}

function openHotspot(i){
  const h = CONOZCO_HOTSPOTS[i];
  const panel = document.getElementById('hotspotPanel');
  panel.classList.add('show');
  panel.innerHTML = `<strong>${h.ico} ${h.q}</strong><br>${h.a}`;
  hotspotsSeen.add(i);
  if(hotspotsSeen.size>=2){
    document.getElementById('reflectionBlock').style.display='block';
  }
}
/* Reproduce/pausa el audio real de la narraciÃ³n (ya no usa voz sintÃ©tica) */
function toggleNarration(){
  const icon = document.getElementById('playIcon');
  let audio = document.getElementById('conozcoAudio');
  if(!audio){
    audio = document.createElement('audio');
    audio.id = 'conozcoAudio';
    audio.src = CONOZCO_AUDIO_SRC;
    audio.style.display = 'none';
    audio.volume = conozcoVolume;
    audio.onended = () => { conozcoPlaying = false; const ic=document.getElementById('playIcon'); if(ic) ic.innerText='â–¶'; };
    document.body.appendChild(audio);
  }
  if(conozcoPlaying){
    audio.pause();
    conozcoPlaying = false;
    if(icon) icon.innerText = 'â–¶';
    return;
  }
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  stopCharacterAudio();
  audio.volume = conozcoVolume;
  audio.play().catch(()=>{});
  conozcoPlaying = true;
  if(icon) icon.innerText = 'â¸';
}
function setConozcoVolume(v){
  conozcoVolume = parseFloat(v);
  const audio = document.getElementById('conozcoAudio');
  if(audio) audio.volume = conozcoVolume;
}
function selReflectionConozco(el){
  document.querySelectorAll('.reflect-opt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('continueBlockConozco912').style.display='block';
}

