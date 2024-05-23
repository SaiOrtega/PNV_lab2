'use strict';

module.exports = (sequelize, DataTypes) => {
  let DepoProvinciaStock = sequelize.define('DepoProvinciaStock', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    idDepoProv: {
      type: DataTypes.INTEGER,
    },
    idLote: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantVacunas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("enViaje", "enStock", "sinStock", "descartado"),
      defaultValue: 'enViaje',
    },
    fechaRecepcion: {
      type: DataTypes.DATE,
      allowNull: true,

    },
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  DepoProvinciaStock.associate = models => {
    DepoProvinciaStock.belongsTo(models.LoteProveedor, {
      foreignKey: 'idLote',

    }),
      DepoProvinciaStock.belongsTo(models.DepositoProv, {
        foreignKey: 'idDepoProv',
      })

  }
  return DepoProvinciaStock


}