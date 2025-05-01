class AppState {
  constructor() {
    if (AppState.instance) {
      return AppState.instance;
    }
    
    this.isLoggedIn = false;
    this.userRole = null;
    this.userData = null;
    this.reservations = [];
    this.listeners = [];
    
    AppState.instance = this;
  }
  
  // Método para actualizar el estado
  setState(newState) {
    Object.assign(this, newState);
    this.notifyListeners();
  }
  
  // Métodos para gestionar el estado de autenticación
  login(userData, role) {
    this.isLoggedIn = true;
    this.userRole = role;
    this.userData = userData;
    this.notifyListeners();
  }
  
  logout() {
    this.isLoggedIn = false;
    this.userRole = null;
    this.userData = null;
    this.notifyListeners();
  }
  
  // Suscripción para updates
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