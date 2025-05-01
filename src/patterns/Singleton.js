class AppState {
  constructor() {
    if (AppState.instance) {
      return AppState.instance;
    }

    const savedSession = JSON.parse(localStorage.getItem('appState'));
    if (savedSession?.isLoggedIn) {
      this.isLoggedIn = true;
      this.userRole = savedSession.userRole;

      // Restaurar userData con funciones según el rol
      if (savedSession.userRole === "customer") {
        this.userData = {
          name: savedSession.userData.name,
          makeReservation: (...args) => {
            console.log("Reserva realizada (simulación)", ...args);
          }
        };
      } else if (savedSession.userRole === "admin") {
        this.userData = {
          name: savedSession.userData.name,
          viewReservations: () => {
            console.log("Vista de reservas del admin (simulación)");
          }
        };
      } else {
        this.userData = null;
      }
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
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  login(userData, role) {
    this.isLoggedIn = true;
    this.userRole = role;
    this.userData = userData;
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  logout() {
    this.isLoggedIn = false;
    this.userRole = null;
    this.userData = null;
    localStorage.removeItem('appState');
    this.notifyListeners();
  }

  saveToLocalStorage() {
    const { isLoggedIn, userRole, userData } = this;
    localStorage.setItem('appState', JSON.stringify({
      isLoggedIn,
      userRole,
      userData: { name: userData?.name }
    }));
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

