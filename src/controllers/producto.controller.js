const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");

// ---------------- GET ALL ----------------
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_Producto_GetAll");
  return sendSpResponse(res, result);
};

// ---------------- GET BY ID ----------------
exports.getById = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_Producto_GetById", {
    idProducto: id
  });

  return sendSpResponse(res, result);
};

// ---------------- SEARCH ----------------
exports.search = async (req, res) => {
  const { texto } = req.query;

  const result = await executeSP("SP_Producto_Search", { texto });

  return sendSpResponse(res, result);
};

// ---------------- CREATE ----------------
exports.create = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_Producto_Create",
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
  const params = req.body;

  const result = await executeSP(
    "SP_Producto_Update",
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
    "SP_Producto_Delete",
    { idProducto: id },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};



// ================= ACTUALIZAR IMAGEN AUTOMÁTICO ==================
exports.actualizarImagenProducto = async (req, res) => {
  try {
    const id = req.params.idProducto;

    if (!req.file) return res.status(400).json({ ok:false, message:"No se subió ninguna imagen" });

    const url = "/uploads/productos/" + req.file.filename; // ruta lista para card

    const pool = await getConnection();
    await pool.request()
      .input("id", id)
      .input("url", url)
      .query(`UPDATE Producto SET urlImagen=@url WHERE idProducto=@id`);

    return res.json({
      ok: true,
      message: "Imagen actualizada y enlazada a BD con éxito",
      urlImagen: url
    });

  } catch(e){
    return res.status(500).json({ ok:false, message:"Error guardando imagen", error:e.message });
  }
};
