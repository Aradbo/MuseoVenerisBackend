const { executeSP } = require("../utils/executeSP");
const { sql } = require("../config/db");

/* 🟡 REGISTRO DE FACTURA PARA VISITANTE */
exports.registrarFacturaPublico = async (req, res) => {
  try {
    const {
      nombreVisitante,
      tipo_tarifa,
      listaProductos,     // "1|2,3|1"
      listaTours,         // "5|2" o null
      idMetodoPago,     
      montoPago           
    } = req.body;

    // VALIDACIONES
    if (!nombreVisitante || !tipo_tarifa || !idMetodoPago || !montoPago)
      return res.status(400).json({
        ok:false,
        message:"Faltan datos obligatorios (nombre, tarifa, idMetodoPago, montoPago)"
      });

    // EJECUTAR SP
    const result = await executeSP("SP_RegistrarFactura_Publico",
      {
        nombreVisitante,
        tipoTarifa: tipo_tarifa,
        listaProductos: listaProductos ?? null,
        listaTours: listaTours ?? null,
        idMetodoPago,
        montoPago
      },
      { codigoFactura: sql.VarChar(200) }
    );

    return res.json({
      ok: true,
      mensaje: "Factura registrada correctamente 🎉",
      codigo: result.output.codigoFactura
    });

  } catch (error) {
    console.error("ERROR FACTURA PUBLICO >>", error);
    return res.status(500).json({
      ok:false,
      message:"Error al registrar factura",
      error:error.message
    });
  }
};


exports.validarFactura = async(req,res)=>{
 try{
   const codigo=req.params.codigoFactura;
   const pool=await getConnection();

   const q=await pool.request()
     .input("codigo",codigo)
     .query(`
       SELECT f.codigo_factura,f.total,f.total_impuesto,f.total_descuento,
       CONCAT(p.primer_nombre,' ',ISNULL(p.segundo_nombre,''),' ',
              p.primer_apellido,' ',ISNULL(p.segundo_apellido,'')) AS visitante,
       pr.tipo_tarifa FROM Factura f
       JOIN Visitante_has_Factura vhf ON vhf.Factura_idFactura=f.idFactura
       JOIN Visitante v ON v.idVisitante=vhf.Visitante_idVisitante
       JOIN Persona p ON p.idPersona=v.Persona_idPersona
       JOIN Precio pr ON pr.idPrecio=vhf.Precio_idPrecio
       WHERE f.codigo_factura=@codigo
     `);

   if(q.recordset.length===0) 
     return res.json({ok:false,msg:"Factura no existe"});

   return res.json({ok:true,data:q.recordset[0]});
 }catch(e){
   res.json({ok:false,msg:"Error servidor"});
 }
};
