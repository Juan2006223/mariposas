// frontend/src/features/app_assets/dominio/AssetKeys.js
/**
 * Canonical registry keys for embedded application visual assets.
 */
(function () {
  const AssetKeys = Object.freeze({
    GALLERY: [
      'GAL1_IMG', 'GAL2_IMG', 'GAL3_IMG', 'GAL4_IMG', 'GAL5_IMG',
      'GAL6_IMG', 'GAL7_IMG', 'GAL8_IMG', 'GAL9_IMG', 'GAL10_IMG',
      'GAL11_IMG', 'GAL12_IMG', 'GAL13_IMG', 'GAL14_IMG', 'GAL15_IMG'
    ],
    MAPS: [
      'MAP_68_IMG', 'EXPLORO_MAP_IMG'
    ],
    TERRITORY: [
      'CONOZCO_BG_IMG', 'DETECTIVE_IMG', 'PLAZA_CENTRAL_IMG',
      'MANIGUA_IMG', 'MURAL_LORO_IMG', 'RESERVA_AVE_IMG',
      'QUEBRADA_SHRINE_IMG', 'FUNDACION_PROM_IMG', 'MIRADOR_CRUZ_IMG',
      'FORMAVIDA_IMG'
    ]
  });

  if (typeof window !== 'undefined') {
    window.AssetKeys = AssetKeys;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AssetKeys };
  }
})();
