const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/descuento.controller");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.get("/search/query", ctrl.search);
router.post("/", ctrl.create);
router.put("/", ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
