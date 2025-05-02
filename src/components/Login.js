import React, { useState } from 'react';
import appState from '../patterns/Singleton';
import UserFactory from '../patterns/UserFactory';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const user = UserFactory.createUser(role, data.user);
        appState.setState({ userData: user });

        // ✅ Redirección o recarga luego del login exitoso
        window.location.reload();
      } else {
        setError(data.message || 'Error de autenticación');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
      console.error(err);
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
