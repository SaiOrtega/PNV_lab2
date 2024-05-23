'use strict';

module.exports = (sequelize, DataTypes) => {
  let VacunasDescarte = sequelize.define('VacunasDescarte', {
    idDescarte: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    idLote: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaDescarte: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_descarte',

    },
    personaACargo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoLote: {
      type: DataTypes.ENUM("LoteNacion", "LoteProvincia", "LoteCentro"),
      allowNull: false,
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
  VacunasDescarte.associate = models => {
    if (models.usuario === null) {
      throw new Error('No se puede establecer asociación con usuario, porque no se ha inicializado antes del modelo.')
    }
    if (models.LoteProveedor === null) {
      throw new Error('No se puede establecer asociación con LoteProveedor, porque no se ha inicializado antes del modelo.')
    }
    VacunasDescarte.belongsTo(models.usuario, {
      foreignKey: 'personaACargo',

    })
    VacunasDescarte.belongsTo(models.LoteProveedor, {
      foreignKey: 'idLote',
      targetKey: 'idLote'
    })

  }
  return VacunasDescarte


}
