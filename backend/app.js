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
    await User.create({ username: "admin", password: "1234" });
    console.log("Usuario admin creado");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
