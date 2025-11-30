const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/exposicion.controller");

// GET
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.get("/buscar/texto", ctrl.search);

// POST
router.post("/", ctrl.create);

// PUT
router.put("/", ctrl.update);

// DELETE
router.delete("/:id", ctrl.delete);

module.exports = router;
