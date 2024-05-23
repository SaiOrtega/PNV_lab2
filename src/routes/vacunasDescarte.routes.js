const router = require('express').Router();

const vacunasDescarteController = require('../controllers/VacunasDescarte.controller');

router.get('/vacunasDescarte', vacunasDescarteController.descarteVacunas);
router.get('/vacunasDescartadas', vacunasDescarteController.vacunasDescartadas);
router.post('/vacunasDescarte', vacunasDescarteController.descarteVacunasPost);
router.post('/descartarVencidas', vacunasDescarteController.descarteVacunasVencidas);
router.get('/filtrarVencidas', vacunasDescarteController.filtrarVencidas);

router.delete("/borrarDescarte/:id", vacunasDescarteController.borrarDescarte);



module.exports = router;