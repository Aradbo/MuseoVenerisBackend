// src/controllers/lugar.controller.js
const { getConnection, sql } = require("../config/db");

// GET /api/lugares/paises
exports.getPaises = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute("SP_Lugar_GetPaises");

    return res.json(result.recordset); // [{ idPais, descripcion }]
  } catch (error) {
    console.error("Error getPaises:", error);
    return res.status(500).json({ ok: false, mensaje: "Error obteniendo países" });
  }
};

// GET /api/lugares/provincias/:idPais
exports.getProvinciasPorPais = async (req, res) => {
  try {
    const { idPais } = req.params;
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("idPais", sql.Int, Number(idPais))
      .execute("SP_Lugar_GetProvinciasPorPais");

    return res.json(result.recordset); // [{ idProvincia, descripcion }]
  } catch (error) {
    console.error("Error getProvinciasPorPais:", error);
    return res.status(500).json({ ok: false, mensaje: "Error obteniendo provincias" });
  }
};

// GET /api/lugares/ciudades/:idProvincia
exports.getCiudadesPorProvincia = async (req, res) => {
  try {
    const { idProvincia } = req.params;
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("idProvincia", sql.Int, Number(idProvincia))
      .execute("SP_Lugar_GetCiudadesPorProvincia");

    return res.json(result.recordset); // [{ idCiudad, descripcion }]
  } catch (error) {
    console.error("Error getCiudadesPorProvincia:", error);
    return res.status(500).json({ ok: false, mensaje: "Error obteniendo ciudades" });
  }
};
