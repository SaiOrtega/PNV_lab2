const router = require('express').Router();

const centroStockController = require('../controllers/CentrosStock.controller');


router.get('/centrosStock', centroStockController.centrosStock);
router.post('/centrosStockPost/:id', centroStockController.centrosStockPost);
router.get('/reasignarLotes', centroStockController.centrosStockReasignar);
router.post('/reasignarLotes', centroStockController.centrosStockReasignarPost);
router.get('/filtrarLotes', centroStockController.centrosAplicar);
router.get('/editarLoteCentro/:id', centroStockController.editarLoteCentro);
router.post('/editarLoteCentro/:id', centroStockController.editarLoteCentroPost);


module.exports = router;