//npm run dev

const express = require("express");
const router = express.Router();
const personaController = require("../controllers/persona.controller");

// Rutas de Persona
router.get("/", personaController.getAll);
router.get("/:id", personaController.getById);

// Login
router.post("/login", personaController.login);

// Registros de visitante y empleado
router.post("/registrar-visitante", personaController.registrarVisitante);
router.post("/registrar-empleado", personaController.registrarEmpleado);

// actualizar y eliminar persona
router.put("/", personaController.update);
router.delete("/:id", personaController.delete);

module.exports = router;