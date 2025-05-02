const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'reservations.sqlite'),
  logging: false
});

// Importar modelos pasándoles la instancia
const User = require('./User')(sequelize);
const Reservation = require('./Reservation')(sequelize);

// Definir relaciones
User.hasMany(Reservation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Reservation };


