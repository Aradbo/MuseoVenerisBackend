// src/routes/visitante.routes.js
const express = require("express");
const router = express.Router();
const visitanteController = require("../controllers/visitante.controller");

// RUTAS VISITANTES
router.get("/", visitanteController.getAll);
router.get("/search", visitanteController.search);
router.get("/:id", visitanteController.getById);
router.put("/", visitanteController.update);
router.delete("/:id", visitanteController.delete);

// REGISTRO COMPLETO DE VISITANTE (PERSONA + VISITANTE + TELÉFONO + DIRECCIÓN)
router.post("/registrar-desde-cero", visitanteController.registrarDesdeCero);


module.exports = router;
