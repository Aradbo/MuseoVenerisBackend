const express = require("express");
const router = express.Router();
const empleadoCtrl = require("../controllers/empleado.controller");
const auth = require("../middleware/auth");
const { executeSP } = require("../utils/executeSP");
const { sql } = require("../config/db");

// ...aquí seguramente ya tienes otros endpoints de empleado


// GET
router.get("/", empleadoCtrl.getAll);
router.get("/:id", empleadoCtrl.getById);
router.get("/buscar/texto", empleadoCtrl.search);

// POST
router.post("/", empleadoCtrl.registrar);

// PUT
router.put("/", empleadoCtrl.update);

// DELETE
router.delete("/:id", empleadoCtrl.delete);


// GET /api/empleados/privilegios/:idEmpleado
router.get("/privilegios/:idEmpleado", async (req, res) => {
  try {
    const { idEmpleado } = req.params;

    const result = await executeSP(
      "SP_GetHistorialPrivilegios",
      { idEmpleado: parseInt(idEmpleado, 10) },
      {}
    );

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "No se encontró historial de privilegios para ese empleado.",
      });
    }

    const fila = result.data[0];

    const privilegiosActuales = fila.PrivilegiosActuales
      ? fila.PrivilegiosActuales.split(",").map((p) => p.trim())
      : [];

    return res.json({
      ok: true,
      empleado: fila.Empleado,
      cargoActual: fila.CargoActual,
      privilegiosActuales,
      privilegiosAnteriores: fila.PrivilegiosAnteriores || null,
    });
  } catch (error) {
    console.error("Error al obtener privilegios del empleado:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener privilegios del empleado.",
    });
  }
});


module.exports = router;
