import React, { useState } from 'react';
import appState from '../patterns/Singleton';

const CustomerReservationForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar si el usuario está autenticado
    if (!appState.isLoggedIn) {
      setErrorMessage('Usuario no autenticado. Inicie sesión para continuar.');
      return;
    }
  
    const reservation = {
      date,
      time,
      guests,
      notes,
      userId: appState.userData.id  // Usamos 'id' como userId
    };
  
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccessMessage('Reserva realizada con éxito');
        
        // Actualizar estado global con la nueva reserva
        appState.setState((prevState) => ({
          reservations: [...prevState.reservations, data]  // Añadimos la nueva reserva al estado
        }));
      } else {
        setErrorMessage('Error al crear la reserva');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('No se pudo conectar con el servidor');
    }
  };
  

  return (
    <div className="reservation-form">
      <h2>Realizar una Reserva</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Hora:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="guests">Número de personas:</label>
          <input
            type="number"
            id="guests"
            min="1"
            max="20"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value, 10))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notas adicionales:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="btn-reserve">Reservar</button>
      </form>
    </div>
  );
};

export default CustomerReservationForm;
