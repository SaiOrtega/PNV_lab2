'use strict';

module.exports = (sequelize, DataTypes) => {
  let Compralote = sequelize.define('Compralote', {
    idCompra: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    idLote: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaCompra: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      field: 'fechaCompra',

    },
    cantVacunas: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  Compralote.associate = models => {
    Compralote.belongsTo(models.LoteProveedor, {
      foreignKey: 'idLote'
    })
  }
  return Compralote


}