
const models = require('../dabase/models/index');

module.exports = {

    registrar: async (req, res) => {
        try {
            const user = await models.usuario.create(req.body);//crear en el mismo orden de las columnas de la tabla y el formulario
            res.json({
                success: true,
                data: {
                    usuario: user
                }
            })

        } catch (error) {
            console.log(error)
        }
    },

    listar: async (req, res) => {
        try {
            const users = await models.usuario.findAll();
            res.json({
                success: true,
                data: {
                    usuarios: users
                }
            })

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    listarInfo: async (req, res) => {
        try {
            const users = await models.usuario.findOne(
                {
                    where: {
                        id: req.params.usuarioId
                    }
                }
            );
            res.json({
                success: true,
                data: {
                    usuario: users
                }
            })

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    prueba: (req, res) => {
        try {
            console.log('prueba OK')
            res.json({ ok: true, message: 'prueba OK' })
        } catch (error) {
            console.log(error)
        }
    },

}