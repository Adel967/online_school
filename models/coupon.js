const Sequelize = require('sequelize');
/** @type {Sequelize.Sequelize} */

const sequelize = require('../util/database');

const Coupon = sequelize.define('coupon', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  salePercentage: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  maxStudents: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lastDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  existingStudents: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  code: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  }
});

module.exports = Coupon;