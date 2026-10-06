// frontend/src/features/estacion_voz/dominio/VozData.js
(function () {
  const PALABRAS_SIMULADAS = [
    'Alegría', 'Calma', 'Amistad', 'Esperanza',
    'Amor', 'Hogar', 'Juego', 'Colores'
  ];

  const PIENSO_TESTIMONY = 'El tiempo siguió pasando. Llegó el acueducto y con él las albercas en las casas. El humo de la leña se fue apagando con la llegada del gas natural, y las bandas que antes daban miedo se fueron, dejando paso a la calma y al orgullo de la comunidad.';

  const PIENSO_MATCH_PAIRS = [
    { id: 'm1', ico: 'mariposa', label: 'Mariposa de la Reserva', matchPlant: 'p1', color: '#9B4DFF' },
    { id: 'm2', ico: 'mariposa', label: 'Mariposa de la Quebrada', matchPlant: 'p2', color: '#5B6FE8' },
    { id: 'm3', ico: 'mariposa', label: 'Mariposa de la Plaza', matchPlant: 'p3', color: '#D946B5' }
  ];

  const PIENSO_MATCH_PLANTS = [
    { id: 'p3', ico: 'flor', label: 'Flores de los jardines' },
    { id: 'p1', ico: 'uvas', label: 'Uvas silvestres' },
    { id: 'p2', ico: 'planta', label: 'Plantas de la ribera' }
  ];

  const PIENSO_MATCH_EXPLAIN = {
    p1: '¡Correcto! En la Reserva Forestal las mariposas se alimentan del néctar de las uvas silvestres.',
    p2: '¡Correcto! Junto a la Quebrada San Cristóbal crecen las plantas que alimentan a sus mariposas.',
    p3: '¡Correcto! En la Plaza y los jardines comunitarios, las flores atraen a las mariposas del barrio.'
  };

  const PIENSO_CHAIN_ITEMS = [
    'Cambio en el territorio',
    'Modificación de un espacio natural',
    'Cambio en la presencia de plantas',
    'Afectación del hábitat de mariposas',
    'Nueva relación con la comunidad'
  ];

  const PIENSO_LEVELS = [
    { n: 1, ico: 'lupa', name: 'Activa tu misión' },
    { n: 2, ico: 'detective', name: '¿Por qué cambió?' },
    { n: 3, ico: 'auricular', name: 'Una voz que cuenta' },
    { n: 4, ico: 'brote', name: 'La naturaleza también cuenta' },
    { n: 5, ico: 'rompecabezas', name: 'Conecta las huellas' }
  ];

  const PIENSO_BADGE_MAP = {
    1: 'huella',
    2: 'mapa',
    3: 'pergamino',
    4: 'mariposa',
    5: 'rompecabezas'
  };

  // Compatibilidad global requerida
  window.palabrasSimuladas = PALABRAS_SIMULADAS;
  window.PIENSO_TESTIMONY = PIENSO_TESTIMONY;
  window.PIENSO_MATCH_PAIRS = PIENSO_MATCH_PAIRS;
  window.PIENSO_MATCH_PLANTS = PIENSO_MATCH_PLANTS;
  window.PIENSO_MATCH_EXPLAIN = PIENSO_MATCH_EXPLAIN;
  window.PIENSO_CHAIN_ITEMS = PIENSO_CHAIN_ITEMS;

  window.VozData = {
    PALABRAS_SIMULADAS,
    PIENSO_TESTIMONY,
    PIENSO_MATCH_PAIRS,
    PIENSO_MATCH_PLANTS,
    PIENSO_MATCH_EXPLAIN,
    PIENSO_CHAIN_ITEMS,
    PIENSO_LEVELS,
    PIENSO_BADGE_MAP
  };
})();
