// backend/models/index.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'reservations.sqlite'),
  logging: false
});

// Pasar sequelize a los modelos como parámetro
const User = require('./User')(sequelize);
const Reservation = require('./Reservation')(sequelize);

// Definir relaciones
User.hasMany(Reservation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync()
  .then(() => console.log('Tablas sincronizadas correctamente'))
  .catch((error) => console.error('Error al sincronizar las tablas:', error));


module.exports = { sequelize, User, Reservation };
