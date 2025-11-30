const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/vistas.controller");

router.get("/empleados-historial", ctrl.empleadosHistorial);
router.get("/obras-arte", ctrl.obrasArte);
router.get("/exposiciones-detalles", ctrl.expoDetalles);
router.get("/facturacion-detalle", ctrl.facturacionDetalle);
router.get("/visitantes", ctrl.visitantes);
router.get("/historial-privilegios", ctrl.privilegiosHistorial);
// Combos para el panel de obras
router.get("/artistas", ctrl.vwArtistas);
router.get("/colecciones", ctrl.vwColecciones);


module.exports = router;