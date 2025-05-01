class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

class Customer extends User {
  constructor(id, name, email, preferences = []) {
    super(id, name, email);
    this.role = 'customer';
    this.preferences = preferences;
    this.reservations = [];
  }
  
  makeReservation(reservation) {
    this.reservations.push(reservation);
    return reservation;
  }
}

class Administrator extends User {
  constructor(id, name, email, restaurantId) {
    super(id, name, email);
    this.role = 'admin';
    this.restaurantId = restaurantId;
  }
  
  approveReservation(reservationId) {
    // Lógica para aprobar reserva
    console.log(`Reserva ${reservationId} aprobada`);
  }
  
  rejectReservation(reservationId, reason) {
    // Lógica para rechazar reserva
    console.log(`Reserva ${reservationId} rechazada: ${reason}`);
  }
}

class UserFactory {
  static createUser(type, userData) {
    switch(type.toLowerCase()) {
      case 'customer':
        return new Customer(userData.id, userData.name, userData.email, userData.preferences);
      case 'admin':
        return new Administrator(userData.id, userData.name, userData.email, userData.restaurantId);
      default:
        throw new Error(`Tipo de usuario no válido: ${type}`);
    }
  }
}

export default UserFactory;