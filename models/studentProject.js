const Sequelize = require('sequelize');
/** @type {Sequelize.Sequelize} */

const sequelize = require('../util/database');

const StudentProject = sequelize.define('studentProject', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  imageLink: {
    type: Sequelize.STRING,
    allowNull: true
  },
  videoLink: {
    type: Sequelize.STRING,
    allowNull: true
  },
  link: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = StudentProject;
