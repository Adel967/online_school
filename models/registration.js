const Sequelize = require('sequelize');
/** @type {Sequelize.Sequelize} */

const sequelize = require('../util/database');

const Registration = sequelize.define('registration', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  birthDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  registrationStatus: {
    type: Sequelize.ENUM('pending', 'accepted', 'rejected','canceled','awaiting_payment','in_progress'),
    defaultValue: 'pending',
    allowNull: false
  },
  paidAmount: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  couponUsed: {
    type: Sequelize.STRING,
    allowNull: true
  },
  finalPrice: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  currency: {
    type: Sequelize.STRING,
    allowNull: false
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  }
});

module.exports = Registration;