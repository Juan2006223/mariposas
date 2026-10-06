// frontend/src/features/estacion_mapa/dominio/MapaTerritorioData.js
/**
 * Paradas y lugares de exploración territorial para Estación 4 (6-8 y 9-12).
 */
(function () {
  const hitos = [
    'Plaza Central: antes de ser una plazoleta con murales y bancas, este lugar fue un cauce natural por donde corría el agua. Hoy es el corazón del barrio: aquí se encuentran los vecinos, se celebran fiestas comunitarias y los niños juegan después del colegio.',
    'Las Primeras Casas: "Cuando llegué, solo había tres casas", recuerda Alicia Herrera, quien lleva casi cincuenta años viviendo en el territorio. Las familias que llegaron primero construyeron sus hogares con madera y mucho esfuerzo, sin luz ni acueducto, apoyándose siempre en sus vecinos.',
    'La Quebrada: antes de que existiera el acueducto, la quebrada San Cristóbal era la principal fuente de agua del barrio. Ahí las mujeres lavaban la ropa mientras conversaban y cuidaban a los más pequeños; hoy es un lugar que la comunidad sueña con recuperar y proteger.',
    'Canelo el Burrito: Canelo es un personaje guía inventado para acompañar a los niños en su recorrido, inspirado en los burros que antiguamente cargaban el agua y los mercados montaña arriba, antes de que llegaran las carreteras. Aunque no es una persona real, representa el esfuerzo de todas las familias que caminaron ese mismo camino.'
  ];

  const MAPA_68_STOPS = [
    { ico: 'vecinos', name: 'Plaza Central' },
    { ico: 'casa', name: 'Las Primeras Casas' },
    { ico: 'gota', name: 'La Quebrada' },
    { ico: 'burrito', name: 'Canelo el Burrito' }
  ].map((s, i) => ({ ...s, text: hitos[i] }));

  const MAP_VIDEOS = { 0: null, 1: null, 2: null, 3: null };

  const EXPLORO_PLACES = [
    { ico: 'vecinos', name: 'Plaza Central', cat: 'Punto de encuentro', c: 'var(--rosa)', desc: 'El corazón del barrio: antes fue un cauce natural de agua, hoy es donde se celebran las fiestas comunitarias.', relato: 'Aquí los niños juegan después del colegio y los vecinos se encuentran cada fin de semana.', get img() { return typeof window !== 'undefined' ? window.PLAZA_CENTRAL_IMG : ''; }, imgCaption: 'La plaza, con las casas coloridas de La Mariposa trepando por la montaña.', pos: { left: '41%', top: '78%' } },
    { ico: 'teatro', name: 'Fundación Cultural Manigua', cat: 'Lugar significativo', c: '#2EC4B6', desc: 'Organización cultural del territorio que promueve el arte, la música, el teatro musical y la identidad comunitaria.', relato: '"La cultura también transforma un barrio", afirman quienes hacen parte de esta fundación.', get img() { return typeof window !== 'undefined' ? window.MANIGUA_IMG : ''; }, imgCaption: 'El grupo de percusión de la fundación, en una presentación comunitaria.', pos: { left: '24%', top: '80%' } },
    { ico: 'pinta', name: 'Mural del Loro', cat: 'Mural', c: 'var(--sol)', desc: 'Uno de los más de 2.800 murales que forman el Macromural de La Mariposa.', relato: '"Los murales son nuestra historia pintada", dice Martha Vivas, habitante del territorio.', get img() { return typeof window !== 'undefined' ? window.MURAL_LORO_IMG : ''; }, imgCaption: 'Poli era la mascota de un habitante de la comunidad, quien quiso que lo pintaran en este mural para recordarlo en las escaleras del barrio.', pos: { left: '72%', top: '49%' } },
    { ico: 'arbol', name: 'Reserva Forestal', cat: 'Espacio natural', c: 'var(--verde)', desc: 'Un tesoro natural lleno de flora y fauna en la parte alta de la montaña.', relato: 'Colibríes, mariposas, clarineros escarlata y uvas silvestres viven en este lugar.', get img() { return typeof window !== 'undefined' ? window.RESERVA_AVE_IMG : ''; }, imgCaption: 'Un clarinero escarlata escondido entre los árboles de la reserva, en Cerro Norte.', pos: { left: '71%', top: '25%' } },
    { ico: 'gota', name: 'Quebrada San Cristóbal', cat: 'Espacio natural', c: 'var(--rio)', desc: 'Antigua fuente de agua y lugar de encuentro comunitario.', relato: 'Las familias lavaban la ropa aquí antes de que llegara el acueducto al barrio.', get img() { return typeof window !== 'undefined' ? window.QUEBRADA_SHRINE_IMG : ''; }, imgCaption: 'Una pequeña capilla con la Virgen, en lo alto de la quebrada, cuidada por la comunidad.', pos: { left: '44%', top: '49%' } },
    { ico: 'corazon', name: 'Fundación Promoción Humana', cat: 'Lugar significativo', c: 'var(--cafe)', desc: 'Más de 40 años acompañando a niños y adultos mayores del territorio.', relato: '"Ha sido un punto de encuentro, un lugar de puertas abiertas", cuenta Yeimy Herrera.', get img() { return typeof window !== 'undefined' ? window.FUNDACION_PROM_IMG : ''; }, imgCaption: 'Un taller de cartografía social con habitantes del territorio, dibujando juntos su barrio.', pos: { left: '71%', top: '78%' } },
    { ico: 'cometa', name: 'Mirador de la Cruz', cat: 'Espacio natural', c: '#9B7EDE', desc: 'El lugar donde las familias se sienten libres al volar cometas.', relato: 'Desde aquí se contempla toda la ciudad de Bogotá.', get img() { return typeof window !== 'undefined' ? window.MIRADOR_CRUZ_IMG : ''; }, imgCaption: 'La cruz del mirador, con toda Bogotá extendida al fondo.', pos: { left: '50%', top: '13%' } },
    { ico: 'circo', name: 'Fundación Forma Vida', cat: 'Lugar significativo', c: 'var(--violeta)', desc: 'Organización comunitaria que acompaña a las familias del territorio a través del circo social, el refuerzo escolar, el cuidado de niños y adultos mayores, la educación religiosa y el cuidado de la reserva forestal.', relato: '"El circo nos ha enseñado a soñar y a trabajar en comunidad", cuenta Carol Avendaño, profesora de circo en la fundación.', get img() { return typeof window !== 'undefined' ? window.FORMAVIDA_IMG : ''; }, imgCaption: 'Una calle de Santa Cecilia Alta, cerca de donde trabaja la Fundación Forma Vida con la comunidad.', pos: { left: '26%', top: '19%' } }
  ];

  const exploroQuestions = [
    '¿Qué hace especial este lugar?',
    '¿Cómo crees que se sienten las personas cuando están aquí?',
    '¿Qué historia podría contar este lugar?',
    '¿Qué cambiaría si este lugar desapareciera?',
    '¿Qué conservarías de este espacio?'
  ];

  if (typeof window !== 'undefined') {
    window.hitos = hitos;
    window.MAPA_68_STOPS = MAPA_68_STOPS;
    window.MAP_VIDEOS = MAP_VIDEOS;
    window.EXPLORO_PLACES = EXPLORO_PLACES;
    window.exploroQuestions = exploroQuestions;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hitos, MAPA_68_STOPS, MAP_VIDEOS, EXPLORO_PLACES, exploroQuestions };
  }
})();
