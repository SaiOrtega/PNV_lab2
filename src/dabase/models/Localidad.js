'use strict';

module.exports = (sequelize, DataTypes) => {
  let Localidad = sequelize.define('Localidad', {
    idLocalidad: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    provincia: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  Localidad.associate = models => {
    Localidad.hasMany(models.DepositoNacion, {
      foreignKey: 'idLocalidad',

    }),
      Localidad.hasMany(models.CentroVacunacion, {
        foreignKey: 'idLocalidad',
      }),

      Localidad.hasMany(models.DepositoProv, {
        foreignKey: 'idLocalidad',
      })
  }

  return Localidad

}