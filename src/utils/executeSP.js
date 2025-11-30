const { getConnection, sql } = require("../config/db");

async function executeSP(spName, params = {}, outputParams = {}) {
  try {
    const pool = await getConnection();
    const request = pool.request();

    // Inputs
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }

    // Outputs
    for (const [key, type] of Object.entries(outputParams)) {
      request.output(key, type);
    }

    const result = await request.execute(spName);

   return {
      ok: true,
      data: result.recordset,       // primer SELECT
      recordsets: result.recordsets, // TODOS los SELECT
      output: result.output || {}
    };

  } catch (error) {
    console.error("Error ejecutando SP:", spName, error);
    return {
      ok: false,
      message: error.message
    };
  }
}

module.exports = { executeSP };
