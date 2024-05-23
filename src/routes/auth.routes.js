const router = require('express').Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const authScheme = require('../middlewares/schemes/auth.scheme');
const usuarioScheme = require('../middlewares/schemes/usuario.scheme');

router.post('/login', validate(authScheme.login), authController.login);
router.post('/registrarse', validate(usuarioScheme.crearUsuario), authController.registrarse);
router.post("/logout", authController.logout);

module.exports = router

