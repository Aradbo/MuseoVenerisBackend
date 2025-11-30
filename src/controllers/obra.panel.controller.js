const { getConnection, sql } = require("../config/db");

exports.getObrasPanel = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM VW_Obras_Detalle");

    return res.json({ ok: true, data: result.recordset });
  } catch (e) {
    console.log("❌ Error obteniendo obras panel", e);
    return res.status(500).json({ ok:false, message:"Error cargando obras" });
  }
};
