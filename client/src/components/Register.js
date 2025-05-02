import React, { useState } from 'react';
import appState from '../patterns/Singleton';
import UserFactory from '../patterns/UserFactory';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {  // Cambiar a /api/register
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password, role })  // Incluir role en el cuerpo de la solicitud
      });

      const data = await response.json();

      if (response.ok) {
        // Mostrar mensaje de éxito
        setSuccessMessage('Registro exitoso. Puedes iniciar sesión ahora.');

        // No es necesario actualizar el estado global o redirigir en el registro, pero puedes hacerlo si lo prefieres
        // appState.setState({
        //   isLoggedIn: true,
        //   userRole: role,
        //   userData: UserFactory.createUser(role, data.user)
        // });

        // Redirigir al login si se desea
        // window.location.href = '/login';  // Descomentar si deseas redirigir a login después del registro
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>

      {/* Mostrar mensaje de éxito o error */}
      {successMessage && <div className="success-message">{successMessage}</div>}
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

        <button type="submit" className="btn-register">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
