const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// ---------------- GET ALL EMPLEADOS ----------------
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_Empleado_GetAll");
  return sendSpResponse(res, result);
};

// ---------------- GET EMPLEADO BY ID ----------------
exports.getById = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_Empleado_GetById", {
    idEmpleado: id
  });

  return sendSpResponse(res, result);
};

// ---------------- SEARCH EMPLEADOS ----------------
exports.search = async (req, res) => {
  const { texto } = req.query;

  const result = await executeSP("SP_Empleado_Search", { texto });

  return sendSpResponse(res, result);
};

// ---------------- REGISTRAR EMPLEADO COMPLETO ----------------
exports.registrar = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_RegistrarEmpleadoCompleto",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// ---------------- UPDATE EMPLEADO ----------------
exports.update = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_Empleado_Update",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// ---------------- DELETE EMPLEADO ----------------
exports.delete = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP(
    "SP_Empleado_Delete",
    { idEmpleado: id },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};
