const router = require('express').Router();

const depoProvStockController = require('../controllers/DepoProvStock.controller');


router.get('/depositoProvinciaStock', depoProvStockController.muestraStockProv);
router.post('/marcarRecepcion/:id', depoProvStockController.muestraStockProvRecep);
router.get('/editarLoteProv/:id', depoProvStockController.editarLoteProv);
router.post('/editarLoteProvPost/:id', depoProvStockController.editarLoteProvPost)



module.exports = router;