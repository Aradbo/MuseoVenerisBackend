const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/facturaImpuesto.controller");

router.get("/", ctrl.getAll);
router.get("/search/query", ctrl.search);
router.post("/", ctrl.add);
router.delete("/:idFactura/:idImpuesto", ctrl.delete);

module.exports = router;
