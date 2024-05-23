'use strict';

module.exports = (sequelize, DataTypes) => {
  let CentroVacunacionStock = sequelize.define('CentroVacunacionStock', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    cantVacunas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaRecepcion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("enViaje", "enStock", "sinStock", "descartado"),
      allowNull: false,
      defaultValue: "enViaje"
    },
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  CentroVacunacionStock.associate = models => {
    CentroVacunacionStock.belongsTo(models.DepoProvinciaStock, {
      foreignKey: 'idSublote',

    }),

      CentroVacunacionStock.belongsTo(models.CentroVacunacion, {
        foreignKey: 'idCentro',
      })

  }
  return CentroVacunacionStock


}