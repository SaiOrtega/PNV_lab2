const router = require('express').Router();

const centroVacunacionController = require('../controllers/CentrosVacunacion.controller');

router.get('/agregarCentro', centroVacunacionController.agregarCentro);
router.post('/agregarCentro', centroVacunacionController.agregarCentroPost);



module.exports = router;