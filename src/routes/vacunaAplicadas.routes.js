const router = require('express').Router();

const vacunasAplicadasController = require('../controllers/VacunasAplicadas.controller');


router.get('/aplicacionVacuna', vacunasAplicadasController.aplicacionVacuna);
router.post('/aplicacionVacunaPost', vacunasAplicadasController.aplicacionVacunaPost);
router.get('/vacunasAplicadas', vacunasAplicadasController.mostrarAplicaciones);
router.get('/filtrarAplicadas', vacunasAplicadasController.filtrarAplicadas);
router.delete('/borrarAplicacion/:id', vacunasAplicadasController.borrarAplicacion);
router.get('/listadoVacunasAplicadasVencidas', vacunasAplicadasController.listadoPersonasVacunaVencida);



module.exports = router;