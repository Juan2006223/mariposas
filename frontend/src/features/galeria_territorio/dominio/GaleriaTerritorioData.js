(function () {
  function getGaleriaData() {
    return [
      {
        img: window.GAL1_IMG || '',
        title: 'Mural del Loro, La Perla',
        caption: 'La fachada pintada con el loro y la mariposa azul, en el barrio La Perla Oriental.',
      },
      {
        img: window.GAL2_IMG || '',
        title: 'Mural del perrito y las flores',
        caption: 'Un mural con flores blancas, un pájaro y un perro, pintado en lo alto de una fachada.',
      },
      {
        img: window.GAL3_IMG || '',
        title: 'Bogotá desde lo alto',
        caption: 'Vista panorámica de la ciudad bajo un cielo cargado de nubes.',
      },
      {
        img: window.GAL4_IMG || '',
        title: 'Mural "Gritos"',
        caption: 'Un grupo descansa junto a un mural que retrata las voces del territorio, con la ciudad de fondo.',
      },
      {
        img: window.GAL5_IMG || '',
        title: 'Parque infantil de La Mariposa',
        caption: 'Un parque infantil colorido con las casas del barrio trepando la montaña al fondo.',
      },
      {
        img: window.GAL6_IMG || '',
        title: 'Calle de La Mariposa',
        caption: 'Una calle empinada del barrio, con una buganvilia morada floreciendo sobre las casas de ladrillo.',
      },
      {
        img: window.GAL7_IMG || '',
        title: 'Mural geométrico',
        caption: 'Un mural de formas geométricas y colores vivos, con la figura de una mujer y un niño pintada en blanco y negro.',
      },
      {
        img: window.GAL8_IMG || '',
        title: 'Mural de aves',
        caption: 'Un ave adulta alimentando a sus crías, pintada sobre una fachada azul.',
      },
      {
        img: window.GAL9_IMG || '',
        title: 'La Virgen de la quebrada',
        caption: 'La pequeña capilla con la Virgen, en lo alto de una roca rodeada de vegetación.',
      },
      {
        img: window.GAL10_IMG || '',
        title: 'Mural del colibrí',
        caption: 'Un colibrí posado junto a una gran flor rosada, pintado en una fachada de ladrillo.',
      },
      {
        img: window.GAL11_IMG || '',
        title: 'Mural "Usaka Emergente"',
        caption: 'Un campesino con una mazorca en la mano, junto a un burro, en un mural sobre la identidad campesina del territorio.',
      },
      {
        img: window.GAL12_IMG || '',
        title: 'Rampa de Tierra S.O.S.',
        caption: 'Una rampa pintada de amarillo y morado, junto a un mural de una niña y un colibrí.',
      },
      {
        img: window.GAL13_IMG || '',
        title: 'Mural de flores',
        caption: 'Una niña con sombrero entre flores blancas y rosadas, en un mural de colores vivos.',
      },
      {
        img: window.GAL14_IMG || '',
        title: 'Ladera colorida',
        caption: 'Las casas de colores de La Mariposa trepando la ladera, con Bogotá extendida al fondo.',
      },
      {
        img: window.GAL15_IMG || '',
        title: 'Mural "De la Mariposa pa el mundo"',
        caption: 'Un mural con niños en bicicleta y cometas, con el mensaje "De la Mariposa pa el mundo".',
      },
    ];
  }

  // Compatibilidad global con código existente que acceda a GALERIA_TERRITORIO
  const data = getGaleriaData();
  window.GALERIA_TERRITORIO = data;

  window.GaleriaTerritorioData = {
    getGaleriaData,
    getItems: () => (window.GALERIA_TERRITORIO && window.GALERIA_TERRITORIO.length ? window.GALERIA_TERRITORIO : getGaleriaData()),
  };
})();
