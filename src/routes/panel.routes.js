const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/panel.controller");

router.get("/resumen", ctrl.getPanelResumen);


module.exports = router;