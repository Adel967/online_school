const Sequelize = require('sequelize');
/** @type {Sequelize.Sequelize} */

const sequelize = require('../util/database');

const User =  sequelize.define(
    'user',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
        
        },
        birthDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        resetToken: {
            type: Sequelize.STRING,
            allowNull: true
        },
        resetTokenExpiration: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }
);

module.exports = User;