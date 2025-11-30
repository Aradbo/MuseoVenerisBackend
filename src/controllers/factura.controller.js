const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");
const { sql } = require("../config/db");


// GET ALL
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_Factura_GetAll");
  return sendSpResponse(res, result);
};

// GET BY ID (4 SELECTs)
exports.getById = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP("SP_Factura_GetById", {
    idFactura: id
  });

  if (!result.ok) return res.status(500).json(result);

  return res.json({
    ok: true,
    cabecera: result.recordsets[0] || [],
    detalle: result.recordsets[1] || [],
    pagos: result.recordsets[2] || [],
    visitantes: result.recordsets[3] || []
  });
};

// DELETE
exports.delete = async (req, res) => {
  const { id } = req.params;

  const result = await executeSP(
    "SP_Factura_Delete",
    { idFactura: id },
    {
      TipoMensaje: sql.Int,
      Mensaje: sql.VarChar(200)
    }
  );

  return sendSpResponse(res, result);
};

// VISITANTE_FACTURA: GET POR VISITANTE
exports.getByVisitante = async (req, res) => {
  const { idVisitante } = req.params;

  const result = await executeSP("SP_VisitanteFactura_GetByVisitante", {
    idVisitante
  });

  return sendSpResponse(res, result);
};

// VISITANTE_FACTURA: GET POR FACTURA
exports.getByFactura = async (req, res) => {
  const { idFactura } = req.params;

  const result = await executeSP("SP_VisitanteFactura_GetByFactura", {
    idFactura
  });

  return sendSpResponse(res, result);
};

// REGISTRAR FACTURA COMPLETA
exports.registrarFacturaCompleta = async (req, res) => {
  const params = req.body;

  const result = await executeSP(
    "SP_RegistrarFacturasCompleta",
    params,
    {
      codigoFactura: sql.VarChar(150)
    }
  );

  return res.json({
    ok: true,
    codigoFactura: result.output.codigoFactura,
    resultadoDB: result
  });
};
