const Sequelize = require('sequelize');
/** @type {Sequelize.Sequelize} */

const sequelize = require('../util/database');

const Course = sequelize.define('course', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  sessionNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  weeksNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  studentsPerGroup: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  studentAgeRange: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coursePrices: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: {
      USD: 100,
      EGP: 1000,
      SYR: 10000
    }
  },
  courseSale: {
    type: Sequelize.FLOAT,
    allowNull: true,
  }
});

module.exports = Course;
