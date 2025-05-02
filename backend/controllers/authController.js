const { User } = require('../models');
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

    res.json({
      token: "fake-jwt-token",
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en login" });
  }
};
