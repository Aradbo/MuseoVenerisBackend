const express = require("express");
const router = express.Router();
const controller = require("../controllers/factura.controller");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

router.delete("/:id", controller.delete);

router.get("/visitante/:idVisitante", controller.getByVisitante);
router.get("/detalle/por-factura/:idFactura", controller.getByFactura);

router.post("/registrar-completa", controller.registrarFacturaCompleta);


module.exports = router;
