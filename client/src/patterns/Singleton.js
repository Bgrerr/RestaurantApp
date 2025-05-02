class AppState {
  constructor() {
    if (AppState.instance) {
      return AppState.instance;
    }
  
    const savedSession = JSON.parse(localStorage.getItem('appState'));
if (savedSession?.isLoggedIn && savedSession?.userData?.id) {
  this.isLoggedIn = true;
  this.userRole = savedSession.userRole;
  this.userData = savedSession.userData;
} else {
  this.isLoggedIn = false;
  this.userRole = null;
  this.userData = null;
  console.error("No se pudo restaurar la sesión, los datos están incompletos.");
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
    if (userData && userData.id) {
      this.isLoggedIn = true;
      this.userRole = role;
      this.userData = { ...userData };  // Asegúrate de que el id esté en userData
      this.saveToLocalStorage();
      console.log("Login exitoso. ID de usuario:", userData.id);
      this.notifyListeners();
    } else {
      console.error("El ID de usuario no está disponible durante el login.");
    }
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
      userData // Guarda el objeto completo de userData
    }));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  updateReservation(updatedReservation) {
    if (!updatedReservation.id) {
      console.error("ID de reserva no válido");
      return;
    }
  
    const index = this.reservations.findIndex(res => res.id === updatedReservation.id);
    if (index !== -1) {
      console.log("Actualizando reserva", updatedReservation);
      this.reservations[index] = updatedReservation;
      this.setState({ reservations: this.reservations });
    } else {
      console.warn("Reserva no encontrada para actualizar");
    }
  }
  

  notifyListeners() {
    console.log("Notificando a los listeners con el estado actualizado:", this.reservations);
    for (const listener of this.listeners) {
      listener(this);
    }
  }
  

  addReservation(reservation) {
    try {
      this.reservations.push(reservation);
      this.setState({ reservations: this.reservations });
    } catch (error) {
      console.error("Error al agregar reserva:", error);
    }
  }

  updateReservation(updatedReservation) {
    if (!updatedReservation.id) {
      console.error("ID de reserva no válido");
      return;
    }
  
    const index = this.reservations.findIndex(res => res.id === updatedReservation.id);
    if (index !== -1) {
      this.reservations[index] = updatedReservation;
      this.setState({ reservations: this.reservations });
    } else {
      console.warn("Reserva no encontrada para actualizar");
    }
  }
  

  removeReservation(reservationId) {
    try {
      const updatedReservations = this.reservations.filter(res => res.id !== reservationId);
      if (updatedReservations.length === this.reservations.length) {
        console.warn("Reserva no encontrada para eliminar ");
      }
      this.setState({ reservations: updatedReservations });
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
    }
  }
}

const appState = new AppState();
export default appState;
