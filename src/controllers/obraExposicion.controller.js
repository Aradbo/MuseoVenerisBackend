const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// ======================= GET ALL =======================
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_ObraExposicion_GetAll");
  return sendSpResponse(res, result);
};

// ======================= GET BY EXPOSICION =======================
exports.getByExposicion = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_ObraExposicion_GetByExposicion", {
    idExposicion: id
  });

  return sendSpResponse(res, result);
};

// ======================= GET BY OBRA =======================
exports.getByObra = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_ObraExposicion_GetByObra", {
    idObra_Arte: id
  });

  return sendSpResponse(res, result);
};

// ======================= Agregar MULTIPLE OBRAS =======================
exports.addMultiple = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_ObraExposicion_Agregar",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(500)
    }
  );

  return sendSpResponse(res, result);
};

// ======================= UPDATE =======================
exports.update = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_ObraExposicion_Update",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(300)
    }
  );

  return sendSpResponse(res, result);
};

// ======================= DELETE =======================
//DELETE http://localhost:3000/api/obra-exposicion/3/4 porque pide dos param
exports.delete = async (req, res) => {
  const { idObra, idExpo } = req.params;

  const result = await executeSP(
    "SP_ObraExposicion_Delete",
    {
      idObra_Arte: idObra,
      idExposicion: idExpo
    },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(300)
    }
  );

  return sendSpResponse(res, result);
};
