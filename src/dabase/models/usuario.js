'use strict';

module.exports = (sequelize, DataTypes) => {
  let Usuario = sequelize.define('usuario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }

  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })

  return Usuario


}