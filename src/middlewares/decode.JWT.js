const jwt = require('jsonwebtoken');
const errors = require('../const/errors');
const models = require('../dabase/models/index');
const moment = require('moment');
const globalConstantes = require('../const/globalConstantes');

// module.exports = async function (req, res, next) {
//     console.log(req.header('Authorization'))
//     if (req.header('Authorization') && req.header('Authorization').split(' ').length > 1) {
//         try {
//             let dataToken = jwt.verify(req.header('Authorization').split(' ')[1], globalConstantes.JWT_SECRET);

//             if (dataToken.exp <= moment().unix())
//                 return next(errors.SesionExpirada)

//             res.locals.token = dataToken
//             console.log(dataToken)

//             const usuario = await models.usuario.findOne({
//                 where: {
//                     email: dataToken.email
//                 }
//             })
//             if (!usuario) return next(errors.UsuarioNoAutorizado)
//             res.locals.usuario = usuario
//             next()

//         } catch (error) {
//             return next(errors.SesionExpirada)
//         }
//     } else {
//         return next(errors.UsuarioNoAutorizado)
//     }

// }

// module.exports = async function (req, res, next) {
//     const authHeader = req.header('Authorization');
//     console.log(authHeader);
//     if (authHeader && authHeader.split(' ').length > 1) {
//         try {
//             const token = authHeader.split(' ')[1];
//             const dataToken = jwt.verify(token, globalConstantes.JWT_SECRET);
//             if (dataToken.exp <= moment().unix()) {
//                 return next(errors.SesionExpirada);
//             }
//             const usuario = await models.usuario.findOne({
//                 where: {
//                     email: dataToken.email
//                 }
//             });
//             if (!usuario) {
//                 return next(errors.UsuarioNoAutorizado);
//             }
//             res.locals.token = dataToken;
//             res.locals.usuario = usuario;
//             next();
//         } catch (error) {
//             return next(errors.SesionExpirada);
//         }
//     } else {
//         return next(errors.UsuarioNoAutorizado);
//     }
// }

module.exports = async function (req, res, next) {
    const token = req.cookies.token; // Aquí leemos el token desde las cookies
    console.log(token)
    if (token) {
        try {
            let dataToken = jwt.verify(token, globalConstantes.JWT_SECRET);

            console.log('decodificado ', dataToken)

            if (dataToken.exp <= moment().unix()) {
                return next(errors.SesionExpirada);
            }

            const usuario = await models.usuario.findOne({
                where: {
                    email: dataToken.email
                }
            });

            if (!usuario) {
                return next(errors.UsuarioNoAutorizado);
            }

            res.locals.token = dataToken;

            res.locals.usuario = usuario;
            next();
        } catch (error) {
            return next(errors.SesionExpirada);
        }
    } else {
        return next(errors.UsuarioNoAutorizado);
    }
}


