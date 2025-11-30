const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/obraExposicion.controller");

// Consultas
router.get("/", ctrl.getAll);
router.get("/exposicion/:id", ctrl.getByExposicion);
router.get("/obra/:id", ctrl.getByObra);

// Agregar múltiples obras a una exposición
router.post("/multiple", ctrl.addMultiple);

// Actualizar una relación
router.put("/", ctrl.update);

// Eliminar relación obra-exposición (PK compuesta)
router.delete("/:idObra/:idExpo", ctrl.delete);

module.exports = router;
