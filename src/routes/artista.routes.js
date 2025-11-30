const express = require("express");
const router = express.Router();

const artistaCtrl = require("../controllers/artista.controller");

// GET
router.get("/", artistaCtrl.getAll);
router.get("/:id", artistaCtrl.getById);
router.get("/buscar/texto", artistaCtrl.search);

// POST
router.post("/", artistaCtrl.create);

// PUT
router.put("/", artistaCtrl.update);

// DELETE
router.delete("/:id", artistaCtrl.delete);

module.exports = router;
