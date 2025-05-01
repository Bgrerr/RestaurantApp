import React, { useState } from 'react';
import appState from '../patterns/Singleton';

const CustomerReservationForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear objeto de reserva
    const reservation = {
      id: Date.now().toString(),
      date,
      time,
      guests,
      notes,
      status: 'pending',
      userId: appState.userData.id
    };
    
    // En una aplicación real, aquí se enviaría al backend
    // Para este ejemplo, simplemente actualizamos el estado
    const currentReservations = [...appState.reservations];
    currentReservations.push(reservation);
    appState.setState({ reservations: currentReservations });
    
    // También actualizamos las reservas del usuario
    if (appState.userData.role === 'customer') {
      appState.userData.makeReservation(reservation);
    }
    
    // Mostrar mensaje de éxito
    setSuccess('Reserva realizada con éxito');
    
    // Limpiar el formulario
    setDate('');
    setTime('');
    setGuests(1);
    setNotes('');
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setSuccess(''), 3000);
  };
  
  return (
    <div className="reservation-form">
      <h2>Realizar una Reserva</h2>
      {success && <div className="success-message">{success}</div>}
      
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
            onChange={(e) => setGuests(parseInt(e.target.value))}
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