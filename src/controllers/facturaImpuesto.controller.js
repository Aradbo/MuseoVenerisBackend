const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// GET ALL
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_FacturaImpuesto_GetAll");
  return sendSpResponse(res, result);
};

// SEARCH
exports.search = async (req, res) => {
  const { texto } = req.query;

  const result = await executeSP("SP_FacturaImpuesto_Search", {
    Busqueda: texto
  });

  return sendSpResponse(res, result);
};

// ADD
exports.add = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_FacturaImpuesto_Add",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// DELETE
exports.delete = async (req, res) => {
  const { idFactura, idImpuesto } = req.params;

  const result = await executeSP(
    "SP_FacturaImpuesto_Delete",
    { idFactura, idImpuesto },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};
