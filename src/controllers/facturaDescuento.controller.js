const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// GET ALL
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_FacturaDescuento_GetAll");
  return sendSpResponse(res, result);
};

// SEARCH
exports.search = async (req, res) => {
  const { texto } = req.query;

  const result = await executeSP("SP_FacturaDescuento_Search", {
    Busqueda: texto
  });

  return sendSpResponse(res, result);
};

// ADD
exports.add = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_FacturaDescuento_Add",
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
  const { idFactura, idDescuento } = req.params;

  const result = await executeSP(
    "SP_FacturaDescuento_Delete",
    { idFactura, idDescuento },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};
