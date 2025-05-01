import React, { useState, useEffect } from 'react';
import appState from '../patterns/Singleton';

const AdminReservationManager = () => {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState('');
  
  // Suscribirse a los cambios en el estado global
  useEffect(() => {
    const unsubscribe = appState.subscribe((state) => {
      setReservations(state.reservations);
    });
    
    // Cargar reservas desde el backend
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        appState.setState({ reservations: data });
      })
      .catch(err => {
        console.error('Error al obtener reservas:', err);
      });

    
    // Limpieza al desmontar
    return () => unsubscribe();
  }, []);
  
  const handleApprove = (reservationId) => {
  const updated = reservations.find(r => r.id === reservationId);
  if (!updated) return;

  const updatedReservation = { ...updated, status: 'approved' };

  fetch(`/api/reservations/${reservationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedReservation)
  })
  .then(res => res.json())
  .then(data => {
    const newList = reservations.map(res =>
      res.id === reservationId ? data : res
    );
    setReservations(newList);
    appState.setState({ reservations: newList });
    setMessage('Reserva aprobada');
  })
  .catch(err => {
    console.error('Error al aprobar reserva:', err);
    setMessage('Error al actualizar la reserva');
  });
};
  
  const handleReject = (reservationId) => {
    const updatedReservations = reservations.map(res => {
      if (res.id === reservationId) {
        return { ...res, status: 'rejected' };
      }
      return res;
    });
    
    appState.setState({ reservations: updatedReservations });
    
    // Si hay un usuario administrador autenticado, usar su método rejectReservation
    if (appState.userData && appState.userData.role === 'admin') {
      appState.userData.rejectReservation(reservationId, 'No disponibilidad');
    }
    
    setMessage('Reserva rechazada correctamente');
    setTimeout(() => setMessage(''), 3000);
  };
  
  return (
    <div className="admin-reservation-manager">
      <h2>Gestión de Reservas</h2>
      {message && <div className="message">{message}</div>}
      
      {reservations.length === 0 ? (
        <p>No hay reservas pendientes</p>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Personas</th>
              <th>Estado</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.guests}</td>
                <td>{reservation.status}</td>
                <td>{reservation.notes}</td>
                <td>
                  {reservation.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(reservation.id)}>Aprobar</button>
                      <button onClick={() => handleReject(reservation.id)}>Rechazar</button>
                    </>
                  )}
                  {reservation.status !== 'pending' && (
                    <span>{reservation.status === 'approved' ? 'Aprobado' : 'Rechazado'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReservationManager;
