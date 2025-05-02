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

    // Cargar reservas desde el backend solo una vez
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReservations(data);  // Cargar todas las reservas
          appState.setState({ reservations: data }); // Guardar en el estado global
        } else {
          console.error("Error: los datos de reservas no son un arreglo");
        }
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

    // Asegurarse de que el estado de la reserva es 'pending'
    if (updated.status !== 'pending') {
      setMessage('Solo se pueden aprobar reservas pendientes.');
      return;
    }

    fetch(`/api/reservations/updateStatus`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reservationId, status: 'approved' })  // Enviar id y status
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al aprobar la reserva");
        return res.json();
      })
      .then(data => {
        appState.updateReservation(data);  // Actualiza la reserva en el estado global
        setReservations(prevReservations =>
          prevReservations.map(res => res.id === reservationId ? data : res)
        );
        setMessage('Reserva aprobada correctamente');
      })
      .catch(err => {
        console.error("Error al aprobar la reserva:", err);
        setMessage(`Error al actualizar la reserva: ${err.message}`);
      });
  };

  const handleReject = (reservationId) => {
    const updated = reservations.find(r => r.id === reservationId);
    if (!updated) return;

    // Asegurarse de que el estado de la reserva es 'pending'
    if (updated.status !== 'pending') {
      setMessage('Solo se pueden rechazar reservas pendientes.');
      return;
    }

    fetch(`/api/reservations/updateStatus`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reservationId, status: 'rejected' })  // Enviar id y status
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al rechazar la reserva");
        return res.json();
      })
      .then(data => {
        appState.updateReservation(data);  // Actualiza la reserva en el estado global
        setReservations(prevReservations =>
          prevReservations.map(res => res.id === reservationId ? data : res)
        );
        setMessage('Reserva rechazada correctamente');
      })
      .catch(err => {
        console.error("Error al rechazar la reserva:", err);
        setMessage(`Error al actualizar la reserva: ${err.message}`);
      });
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
