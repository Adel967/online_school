const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Visit = sequelize.define('visit', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip: Sequelize.STRING
});

module.exports = Visit;