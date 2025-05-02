// backend/controllers/authController.js
const { User } = require('../models');  // Asegúrate de importar desde 'models' y no desde 'User' directamente
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Solo responde con los datos necesarios
    res.json({
      token: "fake-jwt-token",
      user: {
        id: user.id,              // 👈 IMPORTANTE: este es el que necesitas
        username: user.username
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en login" });
  }
};
