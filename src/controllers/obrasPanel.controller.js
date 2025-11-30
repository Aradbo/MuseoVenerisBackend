const { getConnection, sql } = require("../config/db");
const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");

exports.getAllObras = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM VW_Obras_Detalle");
    res.json({ ok:true, data: result.recordset });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok:false, message:"Error obteniendo obras" });
  }
};

exports.getObrasPanel = async (req, res) => {
  try {
    const result = await executeSP("SP_ObraArte_GetAll"); // usa SP real existente
    return sendSpResponse(res, result);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ ok:false, message:"Error cargando obras", error });
  }
};


exports.crearObra = async (req, res) => {
  try {
    const {
      titulo, descripcion, anio_creacion,
      dimensiones, idArtista, idColeccion, urls
    } = req.body;

    const result = await executeSP("SP_RegistrarObraArte", {
      titulo,
      descripcion,
      anio_creacion,
      dimensiones,
      idArtista,
      idColeccion,
      urls
    });

    return sendSpResponse(res,result);

  } catch (error) {
    console.log("🚨 Error registrando obra:", error);
    return res.status(500).json({ ok:false, message:"Error registrando obra", error });
  }
};



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
////////////////////////////
exports.actualizar = async (req,res)=>{
  console.log("📥 RECIBIDO UPDATE:", req.body);   // ← MUY IMPORTANTE

  try{
    const result = await executeSP(
      "SP_ObraArte_Update",
      {
        idObra_Arte: req.body.idObra_Arte,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        anio_creacion: req.body.anio_creacion,
        dimensiones: req.body.dimensiones,
        Artista_idArtista: req.body.idArtista,
        Coleccion_idColeccion: req.body.idColeccion,
        urls: req.body.urls
      },
      {
        TipoMensaje: sql.Int,
        Mensaje: sql.VarChar(200)
      }
    );

    console.log("📤 RESPUESTA SP:", result);  // ← Veremos si falla internamente

    return sendSpResponse(res,result);

  }catch(e){
    console.error("❌ ERROR UPDATE:",e);
    res.status(500).json({ok:false,error:e});
  }
};



////////////////////////////////////

exports.eliminarObra = async (req,res)=>{
  try{
    const { id } = req.params;
    const pool = await getConnection();
    await pool.request()
      .input("id",sql.Int,id)
      .query(`DELETE FROM Obra_Arte WHERE idObra_Arte=@id`);

    res.json({ ok:true,message:"Obra eliminada" });

  }catch(e){
    console.log(e);
    res.status(500).json({ ok:false,message:"Error eliminando obra"});
  }
}
