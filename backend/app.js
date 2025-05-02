const express = require('express');
const cors = require('cors');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./models');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reservations', reservationRoutes);
app.use('/api/login', authRoutes);

// Sincronizar DB y crear usuario admin si no existe
sequelize.sync().then(async () => {
  console.log('Base de datos sincronizada');

  const exists = await User.findOne({ where: { username: "admin" } });
  if (!exists) {
    await User.create({ username: "admin@com", password: "1234" });
    console.log("Usuario admin creado");
  }
});

app.put('/api/reservations/:id', (req, res) => {
  const reservationId = parseInt(req.params.id);
  const updatedReservation = req.body;

  const index = reservations.findIndex(r => r.id === reservationId);
  if (index === -1) {
    return res.status(404).json({ message: 'Reserva no encontrada' });
  }

  reservations[index] = { ...reservations[index], ...updatedReservation };
  res.json(reservations[index]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
