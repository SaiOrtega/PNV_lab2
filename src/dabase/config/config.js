const globalConstantes = require('../../const/globalConstantes');

module.exports = {
  "development": {
    "username": globalConstantes.DB_USERNAME,
    "password": globalConstantes.DB_PASSWORD,
    "database": globalConstantes.DB_NAME,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": globalConstantes.DB_USERNAME,
    "password": globalConstantes.DB_PASSWORD,
    "database": globalConstantes.DB_NAME,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": globalConstantes.DB_USERNAME,
    "password": globalConstantes.DB_PASSWORD,
    "database": globalConstantes.DB_NAME,
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
