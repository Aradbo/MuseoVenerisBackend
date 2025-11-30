const { getConnection } = require("../config/db");

async function executeVIEW(query) {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(query);

    return {
      ok: true,
      data: result.recordset
    };

  } catch (error) {
    console.error("Error ejecutando vista:", query, error);
    return {
      ok: false,
      message: "Error ejecutando vista",
      error: error.message
    };
  }
}

module.exports = { executeVIEW };
