const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");   
const { generateToken } = require("../utils/jwt");

// GET ALL PERSONAS
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_Persona_GetAll");
  return sendSpResponse(res, result);
};


// GET PERSONA BY ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_Persona_GetById", {
    idPersona: id
  });

  return sendSpResponse(res, result);
};


// LOGIN UNIFICADO
exports.login = async (req, res) => {
  const { usuario, contrasenia, correo } = req.body;

  const result = await executeSP(
    "SP_LoginUnificado",
    {usuario,contrasenia,correo},
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200),
      TipoUsuario: sql.VarChar(50)
    }
  );

   // Error desde SP
  if (result.output.TipoMensaje !== 0) {
    return sendSpResponse(res, result);
  }

  // Crea token
  const token = generateToken({
    usuario,
    tipoUsuario: result.output.TipoUsuario
  });

  return res.json({
    ok: true,
    mensaje: result.output.Mensaje,
    tipoUsuario: result.output.TipoUsuario,
    token
  });
};


// REGISTRAR VISITANTE COMPLETO
exports.registrarVisitante = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_RegistrarVisitanteCompleto",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};


// REGISTRAR EMPLEADO COMPLETO
exports.registrarEmpleado = async (req, res) => {
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


// UPDATE PERSONA
exports.update = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_Persona_Update",
    params,
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};


// DELETE PERSONA
exports.delete = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP(
    "SP_Persona_Delete",
    { idPersona: id },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};
