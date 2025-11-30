// src/routes/lugar.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/lugar.controller");

router.get("/paises", ctrl.getPaises);
router.get("/provincias/:idPais", ctrl.getProvinciasPorPais);
router.get("/ciudades/:idProvincia", ctrl.getCiudadesPorProvincia);

module.exports = router;
