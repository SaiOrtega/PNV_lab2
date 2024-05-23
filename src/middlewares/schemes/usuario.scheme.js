const Joi = require('joi');

let crearUsuario = Joi.object({
    nombre: Joi.string().required(),
    apellidos: Joi.string().required(),
    dni: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),

})

module.exports = {
    crearUsuario
}