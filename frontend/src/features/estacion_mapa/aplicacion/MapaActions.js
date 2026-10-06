// frontend/src/features/estacion_mapa/aplicacion/MapaActions.js
/**
 * Casos de uso y acciones para el mapa 6-8 y exploración 9-12.
 */
(function () {
  function visitNode(i) {
    const pin = document.getElementById('pin' + i);
    if (pin) pin.classList.add('visited');
    const hitoEl = document.getElementById('hitoText');
    if (hitoEl && window.MAPA_68_STOPS && window.MAPA_68_STOPS[i]) {
      hitoEl.innerText = window.MAPA_68_STOPS[i].name + ': ' + window.MAPA_68_STOPS[i].text;
    }
    if (!window.mapVisited.has(i)) {
      window.mapVisited.add(i);
      const slot = document.getElementById('stampSlot' + (window.mapVisited.size - 1));
      if (slot && window.MAPA_68_STOPS && window.MAPA_68_STOPS[i]) {
        slot.innerText = window.MAPA_68_STOPS[i].ico;
        slot.classList.add('filled');
      }
      try { if (typeof playChime === 'function') playChime(); } catch (e) {}
      if (window.mapVisited.size >= 4) {
        setTimeout(showFavPicker, 500);
      }
    }
    openVideoModal(i);
  }

  function visitarMapa68(i) {
    visitNode(i);
  }

  function videoEmbedHTML(src) {
    if (!src) return '<div class="video-placeholder">Video pendiente<br><span style="font-size:.74rem;">La historia escrita ya está disponible.</span></div>';
    const yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
    if (yt) return '<iframe src="https://www.youtube.com/embed/' + yt[1] + '" title="Video del territorio" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; aspect-ratio:16/9; border:0; border-radius:12px;"></iframe>';
    return '<video src="' + src + '" controls playsinline style="width:100%; border-radius:12px; display:block;"></video>';
  }

  function openVideoModal(i) {
    const s = window.MAPA_68_STOPS && window.MAPA_68_STOPS[i];
    if (!s) return;
    const title = document.getElementById('videoModalTitle');
    const media = document.getElementById('videoModalMedia');
    const text = document.getElementById('videoModalText');
    if (title) title.innerText = s.ico + ' ' + s.name;
    if (media) {
      const src = window.MAP_VIDEOS ? window.MAP_VIDEOS[i] : null;
      media.innerHTML = videoEmbedHTML(src);
    }
    if (text) text.innerText = s.text;
    const modal = document.getElementById('videoModal');
    if (modal) modal.classList.add('show');
  }

  function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) modal.classList.remove('show');
    const media = document.getElementById('videoModalMedia');
    if (media) media.innerHTML = '';
  }

  function showFavPicker() {
    const block = document.getElementById('favPickBlock4_68');
    const chips = document.getElementById('favChips');
    if (!block || !chips || !window.MAPA_68_STOPS) return;
    block.style.display = 'block';
    chips.innerHTML = window.MAPA_68_STOPS.map((s, i) => '<div class="chip" onclick="pickMapFav(' + i + ')">' + s.ico + ' ' + s.name + '</div>').join('');
  }

  function pickMapFav(i) {
    window.mapFavIdx = i;
    document.querySelectorAll('#favChips .chip').forEach((c, idx) => c.classList.toggle('sel', idx === i));
    const btn = document.getElementById('continueBlock4_68');
    if (btn) btn.style.display = 'block';
  }

  async function confirmMapFootprint() {
    if (window.mapFavIdx != null && window.MAPA_68_STOPS) {
      const footprint = {
        name: typeof userName !== 'undefined' ? userName : (window.userName || ''),
        ico: window.MAPA_68_STOPS[window.mapFavIdx].ico,
        place: window.MAPA_68_STOPS[window.mapFavIdx].name
      };
      if (typeof saveMuralArtifact === 'function') {
        const saved = await saveMuralArtifact('huella', footprint);
        if (!saved || !saved.success) return;
      }
      if (Array.isArray(window.muralFootprints)) {
        window.muralFootprints.push(footprint);
      }
    }
    if (typeof setStation === 'function') setStation(5);
  }

  function openPlaceImgModal(p) {
    const title = document.getElementById('placeImgTitle');
    const media = document.getElementById('placeImgMedia');
    const text = document.getElementById('placeImgText');
    if (title) title.innerText = p.ico + ' ' + p.name;
    if (media) media.innerHTML = '<img src="' + p.img + '" style="width:100%; border-radius:12px; display:block;" alt="' + p.name + '">';
    if (text) text.innerText = p.imgCaption || '';
    const modal = document.getElementById('placeImgModal');
    if (modal) modal.classList.add('show');
  }

  function closePlaceImgModal() {
    const modal = document.getElementById('placeImgModal');
    if (modal) modal.classList.remove('show');
  }

  function selBarrio(i) {
    if (!window.placesVisited || !window.EXPLORO_PLACES) return;
    window.placesVisited.add(i);
    const p = window.EXPLORO_PLACES[i];
    const bp = document.getElementById('barrioPanel');
    if (bp) {
      bp.innerHTML = '<strong>' + p.ico + ' ' + p.name + '</strong> <span style="color:var(--ink-soft); font-size:0.72rem;">— ' + p.cat + '</span><br>' + p.desc + '<br><br><button class="tool-btn" onclick="conocerHistoria(' + i + ')">Conocer su historia</button>';
    }
    if (p.img) { openPlaceImgModal(p); }
    const pf = document.getElementById('progFill');
    if (pf) pf.style.width = Math.round(window.placesVisited.size / 8 * 100) + '%';
    const pt = document.getElementById('progText');
    if (pt) pt.innerText = window.placesVisited.size + ' de 8 lugares descubiertos';
    const fb = document.getElementById('favoriteBtnBlock');
    if (fb) fb.style.display = window.placesVisited.size >= 3 ? 'block' : 'none';
    const pins = document.querySelectorAll('.exploro-pin');
    if (pins[i]) pins[i].classList.add('visited');
    const rf = document.getElementById('reflectBlockExploro');
    if (rf) rf.style.display = 'none';
  }

  function conocerHistoria(i) {
    if (!window.EXPLORO_PLACES || !window.exploroQuestions) return;
    const p = window.EXPLORO_PLACES[i];
    const bp = document.getElementById('barrioPanel');
    if (bp) bp.innerHTML = '<strong>' + p.ico + ' ' + p.name + '</strong><br>' + p.relato;
    const q = window.exploroQuestions[i % window.exploroQuestions.length];
    const rq = document.getElementById('reflectQuestion');
    if (rq) rq.innerText = q;
    const rf = document.getElementById('reflectBlockExploro');
    if (rf) rf.style.display = 'block';
  }

  function selFavoritePlace(i) {
    window.favoritePlaceIdx = i;
    if (typeof render === 'function') render();
    const lbl = document.getElementById('favoritePlaceLabel');
    if (lbl && window.EXPLORO_PLACES && window.EXPLORO_PLACES[i]) {
      lbl.innerText = 'Elegiste: ' + window.EXPLORO_PLACES[i].ico + ' ' + window.EXPLORO_PLACES[i].name;
    }
  }

  async function finishExploroFavorite() {
    if (window.favoritePlaceIdx === null || !window.EXPLORO_PLACES) {
      alert('Elige primero un lugar 🦋');
      return;
    }
    const footprint = {
      name: typeof userName !== 'undefined' ? userName : (window.userName || ''),
      ico: window.EXPLORO_PLACES[window.favoritePlaceIdx].ico,
      place: window.EXPLORO_PLACES[window.favoritePlaceIdx].name
    };
    if (typeof saveMuralArtifact === 'function') {
      const saved = await saveMuralArtifact('huella', footprint);
      if (!saved || !saved.success) return;
    }
    if (Array.isArray(window.muralFootprints)) {
      window.muralFootprints.push(footprint);
    }
    window.exploroStage = 'badge';
    if (typeof render === 'function') render();
  }

  if (typeof window !== 'undefined') {
    window.visitNode = visitNode;
    window.visitarMapa68 = visitarMapa68;
    window.videoEmbedHTML = videoEmbedHTML;
    window.openVideoModal = openVideoModal;
    window.closeVideoModal = closeVideoModal;
    window.showFavPicker = showFavPicker;
    window.pickMapFav = pickMapFav;
    window.confirmMapFootprint = confirmMapFootprint;
    window.openPlaceImgModal = openPlaceImgModal;
    window.closePlaceImgModal = closePlaceImgModal;
    window.selBarrio = selBarrio;
    window.conocerHistoria = conocerHistoria;
    window.selFavoritePlace = selFavoritePlace;
    window.finishExploroFavorite = finishExploroFavorite;
  }
})();
