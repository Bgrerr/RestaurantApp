const { Reservation } = require('../models');

// Obtener todas las reservas
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    console.error("Error al obtener las reservas:", error); 
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

// Actualizar el estado de una reserva
exports.updateReservationStatus = async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Faltan datos para actualizar el estado." });
  }

  try {
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada." });
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({ error: "Solo se pueden aprobar o rechazar reservas pendientes." });
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    res.status(500).json({ error: "Error al actualizar la reserva." });
  }
};

// Crear una nueva reserva
exports.createReservation = async (req, res) => {
  const { date, time, guests, notes, userId } = req.body;

  if (!date || !time || !guests) {
    return res.status(400).json({ error: "Faltan datos obligatorios: fecha, hora, invitados o userId." });
  }

  if (guests <= 0) {
    return res.status(400).json({ error: "El número de invitados debe ser mayor que 0." });
  }

  try {
    const newReservation = await Reservation.create({
      date,
      time,
      guests,
      notes,
      userId,
      status: 'pending'
    });

    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    res.status(400).json({ error: "Error al crear reserva" });
  }
};
