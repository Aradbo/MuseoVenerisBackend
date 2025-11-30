// src/controllers/auth.controller.js
const { executeSP } = require("../utils/executeSP");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sql } = require("../config/db");

// =========================================
// LOGIN NORMAL PARA EMPLEADOS Y VISITANTES
// =========================================
exports.login = async (req, res) => {
  const { usuario, contrasenia, correo } = req.body;

  const result = await executeSP(
    "SP_LoginUnificado",
    { usuario, contrasenia, correo },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200),
      TipoUsuario: sql.VarChar(20),
    }
  );

  // ❗ SP devolvió error (contraseña incorrecta, no existe, etc.)
  if (result.output.TipoMensaje !== 0) {
    return res.status(400).json({
      ok: false,
      mensaje: result.output.Mensaje,
    });
  }

  const data = result.data?.[0] || {};
  const tipo = result.output.TipoUsuario; // Empleado / Visitante

  // 🟥 SI EL CORREO ES CORPORATIVO = DEBE SER EMPLEADO
  if (correo.endsWith("@museoveneris.com") && tipo !== "Empleado") {
    return res.status(403).json({
      ok: false,
      mensaje: "Este correo es corporativo pero no pertenece a un empleado registrado."
    });
  }

  // 🟩 GENERAR TOKEN
  const token = jwt.sign(
    {
      usuario,
      correo,
      tipoUsuario: tipo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.json({
    ok: true,
    tipoUsuario: tipo,
    token,
    idPersona: data.idPersona || null,
    idEmpleado: data.idEmpleado || null,
    idVisitante: data.idVisitante || null,
  });
};



// ----------------------------------------------------
// LOGIN CON GOOGLE
// ----------------------------------------------------
exports.loginGoogle = async (req, res) => {
  try {
    const { correo } = req.body;

    console.log("➡ LoginGoogle recibido:", correo);

    if (!correo) {
      return res.status(400).json({
        ok: false,
        mensaje: "No se recibió el correo de Google",
      });
    }

    const result = await executeSP(
      "SP_LoginUnificado",
      {
        usuario: correo,   // Google NO usa usuario → usamos correo como identificador
        contrasenia: correo, // SP pide contraseña → mandamos algo simbólico
        correo,
      },
      {
        TipoMensaje: sql.Int,
        Mensaje: sql.VarChar(200),
        TipoUsuario: sql.VarChar(20),
      }
    );

    // Cuenta NO existe
   // Cuenta NO existe → 200, pero marcamos requiereRegistro
if (result.output.TipoMensaje === 2) {
  return res.json({
    ok: false,
    requiereRegistro: true,
    correo,
    mensaje: "No existe en la base de datos",
  });
}


    // Empleado NO debería iniciar con Google
    if (result.output.TipoUsuario === "Empleado") {
      return res.status(403).json({
        ok: false,
        mensaje: "Los empleados no pueden iniciar con Google",
      });
    }

    // LOGIN VISITANTE OK
    const token = jwt.sign(
      { correo, tipoUsuario: result.output.TipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      ok: true,
      tipoUsuario: "Visitante",
      token
    });

  } catch (error) {
    console.error("Error loginGoogle", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno en loginGoogle"
    });
  }

};


// ----------------------------------------------------
// REGISTRO VISITANTE (SP_RegistrarVisitanteDesdeCero)
// ----------------------------------------------------
exports.registroVisitante = async (req, res) => {
  try {
    const {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      correo,
      fecha_nacimiento,
      genero,
      usuario,
      contrasenia,
      telefono,
      idPais,
      idProvincia,
      idCiudad,
      referencia,
    } = req.body;

    const result = await executeSP(
      "SP_RegistrarVisitanteDesdeCero",
      {
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        fecha_nacimiento,
        genero,
        usuario,
        contrasenia,
        telefono,
        idPais,
        idProvincia,
        idCiudad,
        referencia,
      },
      {
        TipoMensaje: sql.Int,
        Mensaje: sql.VarChar(200),
      }
    );

    if (!result.ok) {
      console.error("Error SP_RegistrarVisitanteDesdeCero:", result.message);
      return res.status(500).json({
        ok: false,
        mensaje: "Error interno al registrar visitante",
      });
    }

    const tipo = result.output.TipoMensaje;
    const mensaje = result.output.Mensaje;
    const fila = result.data?.[0] || {};

    if (tipo !== 0) {
      // algún problema de validación (correo ya existe, usuario repetido, etc.)
      return res.status(400).json({
        ok: false,
        tipoMensaje: tipo,
        mensaje,
      });
    }

    return res.json({
      ok: true,
      mensaje,
      idPersona: fila.idPersona,
      idVisitante: fila.idVisitante,
    });
  } catch (error) {
    console.error("registroVisitante ERROR:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error inesperado al registrar visitante.",
    });
  }
};
