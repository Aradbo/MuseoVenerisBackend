const express = require("express");
const router = express.Router();
const sucursalCtrl = require("../controllers/sucursal.controller");

router.get("/", sucursalCtrl.getAll);

module.exports = router;
