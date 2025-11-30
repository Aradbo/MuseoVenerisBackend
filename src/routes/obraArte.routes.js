const express = require("express");
const router = express.Router();

const obraCtrl = require("../controllers/obraArte.controller");

// GET
router.get("/", obraCtrl.getAll);
router.get("/:id", obraCtrl.getById);
router.get("/buscar/texto", obraCtrl.search);

// POST
router.post("/", obraCtrl.create);

// PUT
router.put("/", obraCtrl.update);

// DELETE
router.delete("/:id", obraCtrl.delete);

module.exports = router;
