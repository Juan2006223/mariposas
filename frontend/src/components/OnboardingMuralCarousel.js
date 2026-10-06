// Carrusel compacto del mural para aprovechar el espacio de bienvenida.
function onboardingMuralCarouselHTML() {
  const muralList = typeof muralButterflies !== 'undefined' ? muralButterflies : window.muralButterflies;
  const list = Array.isArray(muralList) ? muralList.slice(0, 8) : [];
  if (!list.length) {
    return `
      <div class="onboarding-mural" aria-label="Mural comunitario">
        <div class="onboarding-mural-head">${miIcon('galeria')} Mural comunitario</div>
        <div class="onboarding-mural-empty">${miIcon('mariposa')} Aquí aparecerán las creaciones guardadas.</div>
      </div>`;
  }

  return `
    <div class="onboarding-mural" aria-label="Mural comunitario">
      <div class="onboarding-mural-head">${miIcon('galeria')} Mural comunitario</div>
      <div class="onboarding-mural-track">
        ${list.map((item) => {
          const name = miText(item.butterflyName || item.name || 'Creación');
          const image = item.src
            ? `<img src="${item.src}" alt="${name}"/>`
            : `<div class="onboarding-mural-fallback">${miIcon('mariposa')}</div>`;
          return `<div class="onboarding-mural-card">${image}<span>${name}</span></div>`;
        }).join('')}
      </div>
    </div>`;
}

window.onboardingMuralCarouselHTML = onboardingMuralCarouselHTML;
