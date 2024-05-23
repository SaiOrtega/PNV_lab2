const express = require('express');
const bodyParser = require("body-parser");
const globalConstantes = require('./const/globalConstantes');
const routerConfig = require('./routes/index.routes');
const errorHandler = require('./middlewares/error')
let createError = require('http-errors')
var path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')

const configuracionApi = (app) => {

    //app.use(express.json());    
    //app.use(express.urlencoded({ extended: false }));

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(session({ secret: 'mysecretkey-PNV', resave: true, saveUninitialized: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')))

    const viewsPath = path.join(__dirname, './views')
    app.set('view engine', 'pug')
    app.set('views', viewsPath)

    return;
}
const configuracionRouter = (app) => {
    app.get('/', (req, res) => {
        res.render('index', { title: 'Inicio' })
    })
    app.use('/api/', routerConfig.rutas_init());
    app.use('/', routerConfig.rutas_auth());

    app.use(function (req, res, next) {
        next(createError(404))
    })

    app.use(errorHandler)
}

const init = () => {
    const app = express();
    configuracionApi(app);
    configuracionRouter(app);

    app.listen(globalConstantes.PORT, () => {
        console.log(`Servidor escuchando en el puerto http://localhost:${globalConstantes.PORT}`);
    });
}

init();