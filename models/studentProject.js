const Sequelize = require('sequelize');
/** @type {Sequelize.Sequelize} */

const sequelize = require('../util/database');

const StudentProject = sequelize.define('studentProject', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    // Localized titles
  title_en: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title_ar: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  // Localized descriptions
  description_en: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  description_ar: {
    type: Sequelize.TEXT,
    allowNull: false,
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
