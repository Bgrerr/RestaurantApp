// backend/models/Reservation.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Reservation', {
    date: {
      type: DataTypes.DATEONLY,  // Se usa DATEONLY para solo la fecha (sin hora)
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,  // Si necesitas almacenar la hora como texto, está bien
      allowNull: false,
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // tabla referida
        key: 'id'       // clave foránea apunta al id numérico
      }
    }
    
  });
};
