const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// ---------------- GET ALL ----------------
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_ObraArte_GetAll");
  return sendSpResponse(res, result);
};

// ---------------- GET BY ID ----------------
exports.getById = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_ObraArte_GetById", {
    idObra_Arte: id
  });

  return sendSpResponse(res, result);
};

// ---------------- SEARCH ----------------
exports.search = async (req, res) => {
  const { texto } = req.query;

  const result = await executeSP("SP_ObraArte_Search", { texto });

  return sendSpResponse(res, result);
};

// ---------------- CREATE ----------------
exports.create = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      anio_creacion,
      dimensiones,
      urls,
      idArtista,
      idColeccion
    } = req.body;

    const result = await executeSP(
      "SP_ObraArte_Create",
      {
        titulo,
        descripcion,
        anio_creacion,
        dimensiones,
        urls,
        Artista_idArtista: idArtista,
        Coleccion_idColeccion: idColeccion
      },
      {
        TipoMensaje: sql.Int,
        Mensaje: sql.VarChar(200)
      }
    );

    return sendSpResponse(res, result);

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error insertando obra",
      error: error.message
    });
  }
};


// ---------------- UPDATE ----------------
exports.update = async (req, res) => {
  try {
    const {
      idObra_Arte,
      titulo,
      descripcion,
      anio_creacion,
      dimensiones,
      idArtista,
      idColeccion,
      urls
    } = req.body;

    const result = await executeSP(
      "SP_ObraArte_Update",
      {
        idObra_Arte,            // ✔ MATCH
        titulo,                 // ✔ MATCH
        descripcion,
        anio_creacion,
        dimensiones,
        Artista_idArtista: idArtista,        // 🔥 Se mapea al nombre exacto esperado
        Coleccion_idColeccion: idColeccion,  // 🔥 Se mapea correctamente
        urls
      },
      {
        TipoMensaje: sql.Int,
        Mensaje: sql.VarChar(200)
      }
    );

    return sendSpResponse(res, result);

  } catch (err) {
    console.error("Error actualizando obra →", err);
    res.status(500).json({ ok:false, message:"Error actualizando obra", error:err.message });
  }
};


// ---------------- DELETE ----------------
exports.delete = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP(
    "SP_ObraArte_Delete",
    { idObra_Arte: id },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};
