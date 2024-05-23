'use strict';

module.exports = (sequelize, DataTypes) => {
  let Vacuna = sequelize.define('Vacuna', {
    idVacuna: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    idLaboratorio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoVacuna: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nombreComercial: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    paisOrigen: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  Vacuna.associate = models => {
    Vacuna.belongsTo(models.Laboratorio, {
      foreignKey: 'idLaboratorio',

    }),
      Vacuna.hasMany(models.LoteProveedor, {
        foreignKey: 'idVacuna',

      })
  }
  return Vacuna


}