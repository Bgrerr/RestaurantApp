const { Reservation } = require('../models');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    console.error("Error al obtener las reservas:", error); 
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

exports.updateReservationStatus = async (req, res) => {
  const { reservationId, status } = req.body; // 'approved' o 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Estado no válido" });
  }

  try {
    const reservation = await Reservation.findByPk(reservationId);
    
    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Actualizar el estado de la reserva
    reservation.status = status;
    await reservation.save();

    res.json(reservation);  // Responder con la reserva actualizada
  } catch (error) {
    console.error("Error al actualizar el estado de la reserva:", error);
    res.status(500).json({ error: "Error al actualizar el estado de la reserva" });
  }
};

exports.createReservation = async (req, res) => {
  const { date, time, guests, notes, userId } = req.body;

  console.log('Datos recibidos:', req.body);  // Agrega esta línea para depurar

  // Validar que todos los campos necesarios están presentes
  if (!date || !time || !guests) {
    return res.status(400).json({ error: "Faltan datos obligatorios: fecha, hora, invitados o userId." });
  }

  // Validar que `guests` sea un número positivo
  if (guests <= 0) {
    return res.status(400).json({ error: "El número de invitados debe ser mayor que 0." });
  }

  try {
    // Intentar crear la nueva reserva
    const newReservation = await Reservation.create({
      date,
      time,
      guests,
      notes,
      userId  // ← Esto es el username

    });

    // Responder con la nueva reserva creada
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    
    // Si el error es una violación de restricciones o una violación de clave externa, especificar el error
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: "El userId proporcionado no es válido" });
    }

    // Respuesta genérica si ocurre cualquier otro tipo de error
    res.status(400).json({ error: "Error al crear reserva" });
  }
};
