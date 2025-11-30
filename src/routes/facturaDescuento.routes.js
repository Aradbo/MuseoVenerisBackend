const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/facturaDescuento.controller");

router.get("/", ctrl.getAll);
router.get("/search/query", ctrl.search);
router.post("/", ctrl.add);
router.delete("/:idFactura/:idDescuento", ctrl.delete);

module.exports = router;
