'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Función asíncrona para ejecutar el trigger
// const executeTrigger = async () => {
//   try {
//     if (!sequelize) throw new Error('Sequelize not defined');
//     if (!sequelize.query) throw new Error('Sequelize.query not defined');
//     if (!sequelize.query('')) throw new Error('Sequelize.query failed');

//     await sequelize.query(`
//       DELIMITER $$
//       CREATE TRIGGER actualizar_vencida BEFORE INSERT ON loteproveedor FOR EACH ROW
//       BEGIN
//         IF NOT(NEW.fechaVencimiento IS NULL) AND NEW.fechaVencimiento < CURDATE() THEN
//           SET NEW.vencida = TRUE;
//         END IF;
//       END
//       $$
//       DELIMITER ;
//     `);
//     console.log('Trigger ejecutado exitosamente');
//   } catch (error) {
//     console.error('Error al ejecutar el trigger:', error);
//     if (error.stack) console.error(error.stack);
//     else console.error('No stack trace available');
//   }
// };

// // Llamar a la función para ejecutar el trigger
// executeTrigger();


sequelize.sync();


module.exports = db;
