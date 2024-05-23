const { Router } = require('express');

const usuarioRutas = require('./usuario.routes');
const vacunasRutas = require('./vacuna.routes');
const loteRutas = require('./loteProveedor.routes');
const stockProvinciaRutas = require('./depoProvStock.routes');
const compraRutas = require('./compraLotes.routes');
const descarteRutas = require('./vacunasDescarte.routes');
const stockCentrosRutas = require('./centroStock.routes');
const vacunasAplicadasRutas = require('./vacunaAplicadas.routes');
const centroRutas = require('./centroVacunacion.routes');
const authRoutes = require('./auth.routes');
const decodeJWT = require('../middlewares/decode.JWT');
const depositoNacion = require('./depositoNacion.routes');
const depositoProvincia = require('./depositoProvincia.routes')


const chequeoVencimiento = require('../middlewares/chequeoVencimiento')


const rutas_init = () => {
    const router = Router();
    router.use('/usuarios', decodeJWT, usuarioRutas);
    router.use('/vacunas', decodeJWT, vacunasRutas);
    router.use('/compras', decodeJWT, compraRutas);
    router.use('/lotes', decodeJWT, chequeoVencimiento, loteRutas);
    router.use('/stocksProvincias', decodeJWT, chequeoVencimiento, stockProvinciaRutas);
    router.use('/stockCentros', decodeJWT, chequeoVencimiento, stockCentrosRutas);
    router.use('/vacunaciones', decodeJWT, chequeoVencimiento, vacunasAplicadasRutas);
    router.use('/descartes', decodeJWT, chequeoVencimiento, descarteRutas);
    router.use('/centros', decodeJWT, centroRutas);
    router.use('/depositosNacion', decodeJWT, depositoNacion);
    router.use('/depositosProvincias', decodeJWT, depositoProvincia);

    return router;

}
const rutas_auth = () => {
    const router = Router();
    router.use('/auth', authRoutes);
    return router;
}

module.exports = { rutas_init, rutas_auth };