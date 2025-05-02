const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'reservations.sqlite'),
  logging: false // opcional: desactiva logs de SQL en consola
});

// ✅ Importar modelos
const User = require('./User');
const Reservation = require('./Reservation');

// ✅ Definir asociaciones (en caso no estén en los modelos directamente)
User.hasMany(Reservation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

// ✅ Exportar todo junto
module.exports = {
  sequelize,
  User,
  Reservation
};

