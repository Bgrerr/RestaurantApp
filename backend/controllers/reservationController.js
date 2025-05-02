const Reservation = require('../models/Reservation');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

exports.createReservation = async (req, res) => {
  const { date, time, guests, notes, userId } = req.body;

  try {
    const newReservation = await Reservation.create({
      date,
      time,
      guests,
      notes,
      userId
    });

    res.status(201).json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear reserva" });
  }
};

