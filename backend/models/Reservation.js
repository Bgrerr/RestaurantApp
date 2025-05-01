const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Reservation = sequelize.define('Reservation', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  people: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Reservation;
