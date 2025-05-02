const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // ✅ Respuesta corregida con información completa del usuario
    res.json({
      token: "fake-jwt-token",
      user: {
        id: user.id,
        name: user.username,
        email: user.username // o user.email si usas un campo separado
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
};

