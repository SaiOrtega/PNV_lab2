const jwt = require('jsonwebtoken');
const globalConstantes = require('../const/globalConstantes');

module.exports = function (usuario) {

    if (usuario) {
        const token = jwt.sign({
            id: usuario.id,
            email: usuario.email
            //rol: usuario.rol
        },
            globalConstantes.JWT_SECRET,
            {
                expiresIn: '10000m'
            });
        return token

    } else {
        return null
    }

}