const router = require('express').Router();

const depostioNacionController = require('../controllers/DepoNac.controller');

router.get('/agregarDepoNacion', depostioNacionController.agregarDepoNac);
router.post('/agregarDepoNacion', depostioNacionController.agregarDepoNacPost);



module.exports = router;