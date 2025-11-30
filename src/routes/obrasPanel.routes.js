const express = require("express");
const router = express.Router();
const panelCtrl = require("../controllers/obrasPanel.controller");

// LISTAR OBRAS (antes era /obras → ahora queda directo)
router.get("/", panelCtrl.getObrasPanel);

// CREAR OBRA (antes estaba en /obras → lo dejamos limpio)
router.post("/", panelCtrl.crearObra);

module.exports = router;
