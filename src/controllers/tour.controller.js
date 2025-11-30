// src/controllers/tour.controller.js
const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");



// ---------------- GET ALL ----------------
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_Tour_GetAll");
  return sendSpResponse(res, result);
};

// ---------------- GET BY ID ----------------
exports.getById = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_Tour_GetById", {
    idTour: id
  });

  return sendSpResponse(res, result);
};

// ---------------- CREATE ----------------
exports.create = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_Tour_Create",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// ---------------- UPDATE ----------------
exports.update = async (req, res) => {
  const { id } = req.params;
  const params = { ...req.body, idTour: id };

  const result = await executeSP(
    "SP_Tour_Update",
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
    "SP_Tour_Delete",
    { idTour: id },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};
