const models = require('../dabase/models/index');
const errors = require('../const/errors');
const bcrypt = require('bcryptjs');
const signJWT = require('../middlewares/signJWT');

module.exports = {
    login: async (req, res, next) => {

        try {
            const user = await models.usuario.findOne({
                where: {
                    email: req.body.email,
                }
            })

            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                //return next(errors.CredencialesInvalidas)
                //return res.redirect('/?error=CredencialesInválidas');  
                // return res.send(`<script> alert('Credenciales inválidas');
                // window.location.href = '/?error=CredencialesInválidas';
                // </script>`);                
                res.status(200).render('error', { error: errors.CredencialesInvalidas });
            }

            let userName = user.email

            const token = signJWT(user)
            res.cookie('token', token, {
                httpOnly: true
            })
            res.render('app', { title: 'Plan Nacional de Vacunación', userName })
        } catch (error) {
            return next(error)
        }
    },

    // registrarse: async (req, res) => {
    //     try {
    //         if (!req || !req.body) {
    //             throw new Error('Falta el cuerpo del request');
    //         }

    //         const { email, password, nombre, apellidos, dni } = req.body;

    //         if (!email || !password || !nombre || !apellidos || !dni) {
    //             throw new Error('Faltan parámetros en el body');
    //         }

    //         const usuarioExiste = await models.usuario.findOne({
    //             where: {
    //                 email: req.body.email
    //             }
    //         });

    //         if (usuarioExiste) {
    //             throw new Error('Ya existe un usuario con ese email');
    //         }

    //         req.body.password = bcrypt.hashSync(req.body.password, 10);

    //         const user = await models.usuario.create({
    //             nombre: req.body.nombre,
    //             apellidos: req.body.apellidos,
    //             dni: req.body.dni,
    //             email: req.body.email,
    //             password: req.body.password
    //         });
    //         let userName = user.email;

    //         res.render('index', {
    //             message: 'Registrado'
    //         }, { title: 'Plan Nacional de Vacunación', userName });
    //     } catch (error) {
    //         console.error(error);
    //         //res.redirect(`/?error=${error.message}`);
    //         res.status(200).render('error', { error: error });
    //     }
    // },

    logout: async (req, res, next) => {
        try {
            res.clearCookie('token');
            res.render('index')
        } catch (err) {
            return next(err)
        }
    },


    registrarse: async (req, res) => {
        try {
            if (!req || !req.body) {
                throw new Error('Falta el cuerpo del request');
            }

            const { email, password, nombre, apellidos, dni } = req.body;

            if (!email || !password || !nombre || !apellidos || !dni) {
                throw new Error('Faltan parámetros en el body');
            }

            const usuarioExiste = await models.usuario.findOne({
                where: { email: req.body.email }
            });

            if (usuarioExiste) {
                throw new Error('Ya existe un usuario con ese email');
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const user = await models.usuario.create({
                nombre,
                apellidos,
                dni,
                email,
                password: hashedPassword
            });

            // Generar un token JWT

            const token = signJWT(user)
            res.cookie('token', token, {
                httpOnly: true
            })

            // Redirigir al índice con un mensaje de registro exitoso
            res.render('app', {
                message: 'Registrado y autenticado',
                userName: user.email,
                title: 'Plan Nacional de Vacunación'
            });
        } catch (error) {

            console.error(error);
            res.status(404).render('error', { error: error });
        }
    }


}