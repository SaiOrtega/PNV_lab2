const router = require('express').Router();

const LoteProveedorController = require('../controllers/LoteProveedor.controller');


router.post('/loteEstado/:id', LoteProveedorController.modificarEstado)
router.get('/envioVacunas', LoteProveedorController.envioVacunas)
router.post('/envioVacunas', LoteProveedorController.envioVacunasPost)
router.get('/envioVacunasCentros', LoteProveedorController.envioVacunasCentro)
router.post('/envioVacunasCentros', LoteProveedorController.envioVacunasPostCentro)
//router.post('/modCompra', LoteProveedorController.chequeoVencimiento) 
router.get('/lotesProvedor', LoteProveedorController.mostrarLotesProvedor)
router.get('/editarLote/:id', LoteProveedorController.editarLote)
router.post('/editarLote/:id', LoteProveedorController.editarLotePost)


module.exports = router;