'use strict';

module.exports = (sequelize, DataTypes) => {
  let Enfermero = sequelize.define('Enfermero', {
    idEnfermero: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idCentro: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })

  return Enfermero

}