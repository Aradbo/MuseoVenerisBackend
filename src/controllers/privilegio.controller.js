const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// -----------------------------------------
// ASIGNAR PRIVILEGIOS POR CARGO
// -----------------------------------------
exports.asignarPorCargo = async (req, res) => {
  const { idEmpleado } = req.params;

  const result = await executeSP(
    "SP_AsignarPrivilegiosPorCargo",
    { idEmpleado },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// -----------------------------------------
// ASIGNAR PRIVILEGIOS HISTÓRICOS
// -----------------------------------------
exports.asignarHistorico = async (req, res) => {
  const { idEmpleado } = req.params;

  const result = await executeSP(
    "SP_AsignarPrivilegiosHistoricos",
    { idEmpleado },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// -----------------------------------------
// OBTENER HISTORIAL COMPLETO
// -----------------------------------------
exports.getHistorial = async (req, res) => {
  const { idEmpleado } = req.params;

  const result = await executeSP(
    "SP_GetHistorialPrivilegios",
    { idEmpleado }
  );

  return sendSpResponse(res, result);
};

// -----------------------------------------
// ESTADÍSTICAS DIARIAS
// -----------------------------------------
exports.getEstadisticasDiarias = async (req, res) => {
  const result = await executeSP("SP_CalcularEstadisticasDiarias");

  // Este SP devuelve varios recordsets
  return res.json({
    ok: true,
    facturacionHoy: result.recordsets[0] || [],
    visitantesHoy: result.recordsets[1] || [],
    toursHoy: result.recordsets[2] || []
  });
};
