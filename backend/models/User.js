const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const bcrypt = require('bcrypt');

// Definir el modelo de usuario
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Encriptar contraseña antes de crear el usuario
User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// ✅ Importar y definir la relación con Reservation
const Reservation = require('./Reservation');

User.hasMany(Reservation, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Reservation.belongsTo(User, {
  foreignKey: 'userId'
});

module.exports = User;

