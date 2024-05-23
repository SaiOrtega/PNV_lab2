const router = require('express').Router();

const depostioProvicniaController = require('../controllers/DepoProv.controller');

router.get('/agregarDepoProvincia', depostioProvicniaController.agregarDepoProv);
router.post('/agregarDepoProvincia', depostioProvicniaController.agregarDepoProvPost);



module.exports = router;