(function () {
  function getButterflies() {
    return Array.isArray(window.muralButterflies) ? window.muralButterflies : [];
  }

  function getVoices() {
    return Array.isArray(window.muralVoices) ? window.muralVoices : [];
  }

  function getFootprints() {
    return Array.isArray(window.muralFootprints) ? window.muralFootprints : [];
  }

  function getReflections() {
    return Array.isArray(window.muralReflections) ? window.muralReflections : [];
  }

  function getActiveTab() {
    return window._muralTab || 'mariposas';
  }

  function setActiveTab(tab) {
    window._muralTab = tab;
    return window._muralTab;
  }

  window.MuralState = {
    getButterflies,
    getVoices,
    getFootprints,
    getReflections,
    getActiveTab,
    setActiveTab,
  };
})();
