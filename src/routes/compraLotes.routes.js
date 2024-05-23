const router = require('express').Router();

const compraLotesController = require('../controllers/CompraLotes.controller');

router.get('/modCompra', compraLotesController.mostrarCompraLotes);
router.get('/filtrarCompras', compraLotesController.filtrarCompras);




module.exports = router;