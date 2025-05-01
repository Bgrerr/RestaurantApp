class AppState {
  constructor() {
    if (AppState.instance) {
      return AppState.instance;
    }

    // 🆕 Restaurar sesión desde localStorage
    const savedSession = JSON.parse(localStorage.getItem('appState'));
    if (savedSession?.isLoggedIn) {
      this.isLoggedIn = true;
      this.userRole = savedSession.userRole;
      this.userData = savedSession.userData;
    } else {
      this.isLoggedIn = false;
      this.userRole = null;
      this.userData = null;
    }

    this.reservations = [];
    this.listeners = [];

    AppState.instance = this;
  }

  setState(newState) {
    Object.assign(this, newState);
    this.saveToLocalStorage(); // 🆕 Guardar al actualizar estado
    this.notifyListeners();
  }

  login(userData, role) {
    this.isLoggedIn = true;
    this.userRole = role;
    this.userData = userData;
    this.saveToLocalStorage(); // 🆕 Guardar sesión al hacer login
    this.notifyListeners();
  }

  logout() {
    this.isLoggedIn = false;
    this.userRole = null;
    this.userData = null;
    localStorage.removeItem('appState'); // 🆕 Borrar sesión al hacer logout
    this.notifyListeners();
  }

  // 🆕 Guardar sesión en localStorage
  saveToLocalStorage() {
    const { isLoggedIn, userRole, userData } = this;
    localStorage.setItem('appState', JSON.stringify({ isLoggedIn, userRole, userData }));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }
}

const appState = new AppState();
export default appState;
