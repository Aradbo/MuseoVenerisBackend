const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// ---------------- GET ALL ----------------
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_Visitante_GetAll");
  return sendSpResponse(res, result);
};

// ---------------- GET BY ID ----------------
exports.getById = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_Visitante_GetById", {
    idVisitante: id
  });

  return sendSpResponse(res, result);
};

// ---------------- SEARCH ----------------
exports.search = async (req, res) => {
  const { texto } = req.query;

  const result = await executeSP("SP_Visitante_Search", { texto });

  return sendSpResponse(res, result);
};

// ---------------- UPDATE ----------------
exports.update = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_Visitante_Update",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// ---------------- DELETE ----------------
exports.delete = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP(
    "SP_Visitante_Delete",
    { idVisitante: id },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};



// ---------------- REGISTRAR VISITANTE DESDE CERO ----------------
exports.registrarDesdeCero = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_RegistrarVisitanteDesdeCero",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};
