const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// GET ALL
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_Impuesto_GetAll");
  return sendSpResponse(res, result);
};

// GET BY ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_Impuesto_GetById", {
    idImpuesto: id
  });

  return sendSpResponse(res, result);
};

// SEARCH
exports.search = async (req, res) => {
  const { texto } = req.query;

  const result = await executeSP("SP_Impuesto_Search", {
    Busqueda: texto
  });

  return sendSpResponse(res, result);
};

// CREATE
exports.create = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_Impuesto_Add",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// UPDATE
exports.update = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_Impuesto_Update",
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
  const { id } = req.params;

  const result = await executeSP(
    "SP_Impuesto_Delete",
    { idImpuesto: id },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};
