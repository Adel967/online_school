const Sequelize = require('sequelize');
require('dotenv').config();



const sequelize = new Sequelize(process.env.DATABASE_URL,{
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: true
        }
      }
  });

// const sequelize = new Sequelize('school','root','alkt',{
//     dialect: 'mysql',
//     host: 'localhost'
//   });
  
module.exports = sequelize;

