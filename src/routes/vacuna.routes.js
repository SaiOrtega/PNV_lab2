const router = require('express').Router();

const vacunaController = require('../controllers/Vacuna.controller');
const chequeoVencimiento = require('../middlewares/chequeoVencimiento')

router.get('/compra', vacunaController.mostrarCompraVacuna);
router.post('/compra', vacunaController.compraVacuna);
router.get('/crearVacuna', vacunaController.crearVacuna);
router.post('/crearVacuna', vacunaController.crearVacunaPost);




module.exports = router;