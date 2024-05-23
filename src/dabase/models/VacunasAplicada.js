'use strict';

module.exports = (sequelize, DataTypes) => {
  let VacunasAplicada = sequelize.define('VacunasAplicada', {
    idAplicacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    fechaAplicacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }, idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    idEnfermero: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    idLote: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    idLoteCentro: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idCentro: {
      type: DataTypes.INTEGER,
      allowNull: false,

    }
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  VacunasAplicada.associate = models => {

    VacunasAplicada.belongsTo(models.LoteProveedor, {
      foreignKey: 'idLote',

    });
    VacunasAplicada.belongsTo(models.CentroVacunacion, {
      foreignKey: 'idCentro',

    });
    VacunasAplicada.belongsTo(models.CentroVacunacionStock, {
      foreignKey: 'idLoteCentro',

    });
    VacunasAplicada.belongsTo(models.Paciente, {
      foreignKey: 'idPaciente',

    });
    VacunasAplicada.belongsTo(models.Enfermero, {
      foreignKey: 'idEnfermero',

    });

  }
  return VacunasAplicada


}