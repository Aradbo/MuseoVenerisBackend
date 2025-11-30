const { executeVIEW } = require("../utils/executeVIEW");
const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { getConnection } = require("../config/db");

// 1) VW_Empleados_Con_Historial
exports.empleadosHistorial = async (req, res) => {
  const result = await executeVIEW("SELECT * FROM VW_Empleados_Con_Historial");
  return res.json(result);
};

// 2) VW_Obras_Arte
exports.obrasArte = async (req, res) => {
  const result = await executeVIEW("SELECT * FROM VW_Obras_Arte");
  return res.json(result);
};

// 3) vw_Exposiciones_Detalles
exports.expoDetalles = async (req, res) => {
  const result = await executeVIEW("SELECT * FROM vw_Exposiciones_Detalles");
  return res.json(result);
};

// 4) vw_Facturacion_Detalle
exports.facturacionDetalle = async (req, res) => {
  const result = await executeVIEW("SELECT * FROM vw_Facturacion_Detalle");
  return res.json(result);
};

// 5) vw_Visitantes
exports.visitantes = async (req, res) => {
  const result = await executeVIEW("SELECT * FROM vw_Visitantes");
  return res.json(result);
};

// 6) vw_EmpleadoHistorialPrivilegios
exports.privilegiosHistorial = async (req, res) => {
  const result = await executeVIEW("SELECT * FROM vw_EmpleadoHistorialPrivilegios");
  return res.json(result);
};

// ======================= ARTISTAS (combo) =======================
exports.vwArtistas = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        idArtista,
        nombre
      FROM VW_Artistas_GetAll
      ORDER BY nombre;
    `);

    return res.json({
      ok: true,
      msg: "Artistas obtenidos correctamente",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error consultando vista artistas:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error consultando vista artistas",
      error: error.message,
    });
  }
};

// ======================= COLECCIONES (combo) =======================
exports.vwColecciones = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        idColeccion,
        tipo
      FROM VW_Colecciones_GetAll
      ORDER BY tipo;
    `);

    return res.json({
      ok: true,
      msg: "Colecciones obtenidas correctamente",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error consultando vista colecciones:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error consultando vista colecciones",
      error: error.message,
    });
  }
};