const { Router } = require("express");
const ctrl = require("../controllers/privilegio.controller");

const router = Router();

// ASIGNAR PRIVILEGIOS POR CARGO
router.post("/asignar-cargo/:idEmpleado", ctrl.asignarPorCargo);

// ASIGNAR PRIVILEGIOS HISTÓRICOS
router.post("/asignar-historico/:idEmpleado", ctrl.asignarHistorico);

// MOSTRAR HISTORIAL DE PRIVILEGIOS
router.get("/historial/:idEmpleado", ctrl.getHistorial);

// ESTADÍSTICAS DIARIAS
router.get("/estadisticas/hoy", ctrl.getEstadisticasDiarias);

module.exports = router;
