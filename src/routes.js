const express = require ('express');
const routes = express.Router();

const Logout = require('./controllers/Logout');
const Proveedores = require('./controllers/Proveedores');
const Proyectos = require('./controllers/Proyectos');
const Rubros = require('./controllers/Rubros');
const Session = require('./controllers/Session');
const TestDates = require('./controllers/TestDates');
const Transacciones = require('./controllers/Transacciones');
const Reset = require('./controllers/Reset')
const Users = require('./controllers/Users');
const Invoice = require('./controllers/Invoice');

routes.get ('/factura', Invoice.index);

routes.post ('/logout', Logout.create);

routes.get ('/proyectos/:id?', Proyectos.index);
routes.post ('/proyectos', Proyectos.create);
routes.post ('/proyectos-bulk', Proyectos.createBulk);

routes.get ('/proveedores/:id?', Proveedores.index);
routes.post ('/proveedores', Proveedores.create);
routes.post ('/proveedores-bulk', Proveedores.createBulk);
routes.delete ('/proveedores/:id?', Proveedores.delete);
routes.delete ('/proveedores-all', Proveedores.deleteAllRecordsFromProveedores);

routes.post ('/reset-email', Reset.create);
// routes.post ('/code-by-email', CodeByEmailController.create);

routes.get ('/rubros/:id?', Rubros.index);
routes.post ('/rubros', Rubros.create);
routes.post ('/rubros-bulk', Rubros.createBulk);

routes.post ('/session', Session.create);

routes.get ('/transacciones/:id?', Transacciones.index);
routes.post ('/transacciones', Transacciones.create);
routes.post ('/transacciones-bulk', Transacciones.createBulk);
routes.put ('/transacciones', Transacciones.update);
routes.delete ('/transacciones/:id?', Transacciones.delete);
routes.delete ('/transacciones-all', Transacciones.deleteAllRecordsFromTransacciones);

// deleteAllRecordsFromTransacciones
routes.get ('/test-dates/:id?', TestDates.index);
routes.post ('/test-dates', TestDates.create);
routes.delete ('/test-dates/:id?', TestDates.delete);

routes.get ('/users/:id?', Users.index);
routes.post ('/users', Users.create);
routes.put ('/users', Users.update);
routes.delete ('/users/:id?', Users.delete);

module.exports = routes;

// const connection = require ('./database/connection');
// const multer = require("multer");
// const multerConfig = require("./multer");
// const upload = multer(multerConfig);
// const { createTokens, validateToken } = require("../src/JWT");
// const cors = require('cors');
