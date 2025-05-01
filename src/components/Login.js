import React, { useState } from 'react';
import appState from '../patterns/Singleton';
import UserFactory from '../patterns/UserFactory';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // En una aplicación real, aquí iría la verificación con el backend
    if (email && password) {
      // Datos de ejemplo para demostración
      const mockUserData = {
        id: 'user123',
        name: email.split('@')[0],
        email: email,
        preferences: [],
        restaurantId: role === 'admin' ? 'rest123' : null
      };
      
      try {
        // Usar el Factory para crear el tipo de usuario correspondiente
        const user = UserFactory.createUser(role, mockUserData);
        
        // Usar el Singleton para gestionar el estado de la autenticación
        appState.login(user, role);
        
        setError('');
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError('Por favor, complete todos los campos');
    }
  };
  
  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Tipo de usuario:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        
        <button type="submit" className="btn-login">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;