'use strict';

module.exports = (sequelize, DataTypes) => {
  let DepositoNacion = sequelize.define('DepositoNacion', {
    idDepoNacion: {
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
  DepositoNacion.associate = models => {

    DepositoNacion.belongsTo(models.Localidad, {
      foreignKey: 'idLocalidad'
    })
  }
  return DepositoNacion


}