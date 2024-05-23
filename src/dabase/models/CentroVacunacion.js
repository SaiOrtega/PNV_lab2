'use strict';

module.exports = (sequelize, DataTypes) => {
  let CentroVacunacion = sequelize.define('CentroVacunacion', {
    idCentro: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(50)
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  CentroVacunacion.associate = models => {
    CentroVacunacion.belongsTo(models.Localidad, {
      foreignKey: 'idLocalidad',

    }),
      CentroVacunacion.hasMany(models.CentroVacunacionStock, {
        foreignKey: 'idCentro',
      }),
      CentroVacunacion.hasMany(models.VacunasAplicada, {
        foreignKey: 'idCentro',
      }),
      CentroVacunacion.hasMany(models.Enfermero, {
        foreignKey: 'idCentro',
      })

  }

  return CentroVacunacion


}