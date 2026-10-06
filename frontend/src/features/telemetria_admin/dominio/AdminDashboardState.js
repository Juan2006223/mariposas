(function () {
  const state = {
    visible: false,
    tokenKey: 'mariposas_admin_token',
  };

  function getAdminToken() {
    return localStorage.getItem(state.tokenKey) || '';
  }

  function setAdminToken(token) {
    localStorage.setItem(state.tokenKey, token);
  }

  function clearAdminToken() {
    localStorage.removeItem(state.tokenKey);
  }

  function toggleVisible() {
    state.visible = !state.visible;
    return state.visible;
  }

  window.AdminDashboardState = {
    state,
    clearAdminToken,
    getAdminToken,
    setAdminToken,
    toggleVisible,
  };
})();
