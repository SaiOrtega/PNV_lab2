'use strict';

module.exports = (sequelize, DataTypes) => {
  let Paciente = sequelize.define('Paciente', {
    idPaciente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING
    },
    telefono: {
      type: DataTypes.STRING
    },
    direccion: {
      type: DataTypes.STRING
    },
    genero: {
      type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
      allowNull: false
    },
    mail: {
      type: DataTypes.STRING
    }

  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  })
  Paciente.associate = models => {
    Paciente.belongsTo(models.Localidad, {
      foreignKey: 'idLocalidad',

    }),
      Paciente.hasMany(models.VacunasAplicada, {
        foreignKey: 'idPaciente',

      })
  }
  return Paciente


}