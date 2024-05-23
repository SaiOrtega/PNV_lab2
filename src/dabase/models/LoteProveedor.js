'use strict';

module.exports = (sequelize, DataTypes) => {
  let LoteProveedor = sequelize.define('LoteProveedor', {
    idLote: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    idVacuna: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaFabricacion: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      field: 'fecha_fabricacion',

    },
    fechaVencimiento: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      field: 'fecha_vencimiento',
    },
    estado: {
      allowNull: false,
      type: DataTypes.ENUM('enViaje', 'enStock', 'sinStock', 'descartado'),
    },
    cantVacunas: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    fechaAdquisicion: {
      type: DataTypes.DATEONLY,
      field: 'fecha_compra',
    },
    idDepoNacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vencida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }

  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  });

  LoteProveedor.associate = models => {
    LoteProveedor.belongsTo(models.Vacuna, {
      foreignKey: 'idVacuna',
    }),

      LoteProveedor.belongsTo(models.DepositoNacion, {
        foreignKey: 'idDepoNacion', as: "Deposito"
      })


  }
  return LoteProveedor


}