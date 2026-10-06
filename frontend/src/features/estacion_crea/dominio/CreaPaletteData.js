// frontend/src/features/estacion_crea/dominio/CreaPaletteData.js
(function () {
  const DEFAULT_ZONE_COLORS_68 = {
    wingLU: '#3A2E52',
    wingLD: '#453466',
    wingRU: '#3A2E52',
    wingRD: '#453466',
    spotLU1: '#22193A',
    spotLU2: '#22193A',
    spotLD1: '#22193A',
    spotLD2: '#22193A',
    spotRU1: '#22193A',
    spotRU2: '#22193A',
    spotRD1: '#22193A',
    spotRD2: '#22193A',
  };

  const ZONE_TOTAL_68 = 12;

  const PALETTE_COLORS_68 = [
    ['#9B4DFF', 'violeta'],
    ['#5B6FE8', 'rio'],
    ['#FFC857', 'sol'],
    ['#D946B5', 'rosa'],
    ['#4FB286', 'verde'],
    ['#B0793F', 'cafe'],
    ['#2FBFB0', 'turquesa'],
    ['#FF6F59', 'coral'],
    ['#F5EEFF', 'blanco'],
    ['#FF3B7A', 'fucsia'],
    ['#7CE7E1', 'celeste'],
    ['#C9F24B', 'lima'],
  ];

  const SOUND_BY_SON = {
    '#9B4DFF': '🎵 sonido: viento del cerro',
    '#5B6FE8': '🎵 sonido: agua de la quebrada',
    '#FFC857': '🎵 sonido: canto de ave',
    '#D946B5': '🎵 sonido: pasos sobre tierra',
  };

  const BRUSH_COLORS_912 = [
    '#9B4DFF', '#D946B5', '#5B6FE8', '#FFC857',
    '#4FB286', '#1B0F30', '#2EC4B6', '#FF6B6B',
    '#E84393', '#74C0FC', '#A8E063', '#F4A261',
    '#264653', '#6B8E23', '#F7B6D2', '#8D99AE',
  ];

  const CREA_QUALITIES_912 = [
    '🌟 Valiente',
    '🌱 Esperanzadora',
    '❤️ Solidaria',
    '🌈 Alegre',
    '🦋 Libre',
    '🤝 Comunitaria',
    '🌻 Resiliente',
  ];

  const CREA_CATEGORIES_912 = [
    '🌱 Naturaleza',
    '🏡 Territorio',
    '🤝 Comunidad',
    '❤️ Emociones',
    '🧠 Memorias',
    '🚀 Futuro',
  ];

  const LANDING_SPOTS_68 = [
    'Plaza Central',
    'Las Primeras Casas',
    'La Quebrada',
  ];

  window.defaultZoneColors68 = DEFAULT_ZONE_COLORS_68;
  window.ZONE_TOTAL_68 = ZONE_TOTAL_68;
  window.soundBySon = SOUND_BY_SON;

  window.CreaPaletteData = {
    DEFAULT_ZONE_COLORS_68,
    ZONE_TOTAL_68,
    PALETTE_COLORS_68,
    SOUND_BY_SON,
    BRUSH_COLORS_912,
    CREA_QUALITIES_912,
    CREA_CATEGORIES_912,
    LANDING_SPOTS_68,
  };
})();
