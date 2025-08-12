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

  category: {
    type: Sequelize.ENUM('under_12', 'above_12'),
    allowNull: false,
  },

  order: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: 'Used to sort courses and define prerequisites implicitly',
  },

  coursePrices: {
    type: Sequelize.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('coursePrices');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('coursePrices', JSON.stringify(value));
    },
    defaultValue: JSON.stringify({
      USD: 100,
      EGP: 1000,
      SYR: 10000
    })
  },

  courseSale: {
    type: Sequelize.FLOAT,
    allowNull: true,
  }
});

module.exports = Course;