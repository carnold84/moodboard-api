const Sequelize = require('sequelize');

// initialze an instance of Sequelize
const database = new Sequelize({
  database: 'users_test_db',
  username: 'root',
  password: '',
  dialect: 'mysql',
});

// check the databse connection
database
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = database;
