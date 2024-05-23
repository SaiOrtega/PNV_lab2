'use strict';

module.exports = (sequelize, DataTypes) => {
  let Laboratorio = sequelize.define('Laboratorio', {
    idLaboratorio: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pais: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50)
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: false
    }


  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  Laboratorio.associate = models => {
    Laboratorio.hasMany(models.Vacuna, {
      foreignKey: 'idLaboratorio'
    })
  }
  return Laboratorio


}