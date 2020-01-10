const Sequelize = require('sequelize');

// initialze an instance of Sequelize
const database = new Sequelize({
  database: process.env.DATABASE_NAME || 'users_test_db',
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  dialect: 'mysql',
});

// check the databse connection
database
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = database;
