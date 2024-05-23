'use strict';

module.exports = (sequelize, DataTypes) => {
  let DepositoProvincia = sequelize.define('DepositoProv', {
    idDepoProv: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    idLocalidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }

  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  DepositoProvincia.associate = models => {

    DepositoProvincia.belongsTo(models.Localidad, {
      foreignKey: 'idLocalidad',
    }),
      DepositoProvincia.hasMany(models.DepoProvinciaStock, {
        foreignKey: 'idDepoProv'
      })

  }
  return DepositoProvincia


}