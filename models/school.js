const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const School = sequelize.define('school', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  facebookLink: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  instagramLink: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  tiktokLink: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  youtubeLink: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

module.exports = School;