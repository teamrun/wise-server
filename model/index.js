const Sequelize = require('sequelize');
const { user, pass, host, port, dbName } = require('../config').db;


const sequelize = new Sequelize(dbName, user, pass, {
    dialect: 'mysql',
    host, 
    port,
    logging: false,

    pool: {
        max: 5,
        idle: 30000,
        acquire: 60000
    }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });