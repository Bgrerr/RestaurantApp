import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import CustomerReservationForm from './components/CustomerReservationForm';
import AdminReservationManager from './components/AdminReservationManager';
import appState from './patterns/Singleton';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  // Suscribirse a los cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = appState.subscribe((state) => {
      setIsLoggedIn(state.isLoggedIn);
      setUserRole(state.userRole);
    });
    
    return () => unsubscribe();
  }, []);
  
  const handleLogout = () => {
    appState.logout();
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Reservas de Restaurantes</h1>
        {isLoggedIn && (
          <div className="user-info">
            <span>Bienvenido, {appState.userData.name} ({userRole})</span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </div>
        )}
      </header>
      
      <main>
        {!isLoggedIn ? (
          <Login />
        ) : (
          <>
            {userRole === 'customer' && <CustomerReservationForm />}
            {userRole === 'admin' && <AdminReservationManager />}
          </>
        )}
      </main>
      
      <footer>
        <p>&copy; 2025 Sistema de Reservas de Restaurantes</p>
      </footer>
    </div>
  );
}

export default App;