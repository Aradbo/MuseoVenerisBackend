// src/controllers/registroVisitante.controller.js
const { executeSP } = require("../utils/executeSP");
const { sql } = require("../config/db");

// función simple para partir nombre completo (no es perfecta, pero sirve)
function splitNombreCompleto(nombre) {
  const partes = nombre.trim().split(/\s+/);

  const primer_nombre = partes[0] || "";
  const primer_apellido = partes.length > 1 ? partes[partes.length - 1] : "";

  const segundo_nombre =
    partes.length > 3 ? partes[1] : null;

  const segundo_apellido =
    partes.length > 3 ? partes[partes.length - 2] : null;

  return { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido };
}

exports.registrarVisitante = async (req, res) => {
  try {
    const {
      nombreCompleto,
      telefono,
      usuario,
      contrasenia,
      fechaNacimiento, // YYYY-MM-DD
      genero,
      correo,
      idPais,
      idProvincia,
      idCiudad,
      referencia,
    } = req.body;

    const {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
    } = splitNombreCompleto(nombreCompleto);

    const result = await executeSP(
      "SP_RegistrarVisitanteDesdeCero",
      {
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        fecha_nacimiento: fechaNacimiento,
        genero,
        usuario,
        contrasenia,
        telefono,
        idPais: Number(idPais),
        idProvincia: Number(idProvincia),
        idCiudad: Number(idCiudad),
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
        mensaje: "Error interno al ejecutar el SP",
      });
    }

    const { TipoMensaje, Mensaje } = result.output;

    if (TipoMensaje !== 0) {
      // Mensajes de validación del propio SP (correo repetido, usuario repetido, etc.)
      return res.status(400).json({
        ok: false,
        mensaje: Mensaje || "Error de validación al registrar visitante",
      });
    }

    return res.json({
      ok: true,
      mensaje: Mensaje || "Registro de visitante completado.",
      data: result.data && result.data[0],
    });
  } catch (error) {
    console.error("Error registrarVisitante:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error inesperado al registrar visitante",
    });
  }
};
