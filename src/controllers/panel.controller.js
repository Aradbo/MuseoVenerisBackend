const { getConnection } = require("../config/db");

// ===================  PANEL ADMIN  ===================
exports.getPanelResumen = async (req, res) => {
  try {
    const pool = await getConnection();

    // Obras registradas
    const obras = await pool.request().query(`SELECT COUNT(*) AS total FROM Obra_Arte`);

    // Exposiciones activas
    const expos = await pool.request().query(`SELECT COUNT(*) AS total FROM Exposicion WHERE estado='A'`);

    // Productos existentes
    const productos = await pool.request().query(`SELECT COUNT(*) AS total FROM Producto`);

    // Tours activos
    const tours = await pool.request().query(`SELECT COUNT(*) AS total FROM Tour WHERE estado='A'`);

    // Visitantes registrados
    const visitantes = await pool.request().query(`
      SELECT COUNT(*) AS total 
      FROM Visitante v
      INNER JOIN Persona p ON v.Persona_idPersona = p.idPersona
    `);

    // Ventas de hoy
    const facturasHoy = await pool.request().query(`
      SELECT 
        COUNT(*) AS ventasHoy,
        ISNULL(SUM(total),0) AS ingresosHoy
      FROM Factura 
      WHERE CAST(fecha_emision AS DATE) = CAST(GETDATE() AS DATE)
    `);

    return res.json({
      totalObras: obras.recordset[0].total,
      totalExposActivas: expos.recordset[0].total,
      totalProductos: productos.recordset[0].total,
      totalTours: tours.recordset[0].total,
      totalVisitantes: visitantes.recordset[0].total,
      ventasHoy: facturasHoy.recordset[0].ventasHoy,
      ingresosHoy: facturasHoy.recordset[0].ingresosHoy
    });

  } catch (e) {
    console.log("❌ Error Panel:", e);
    return res.status(500).json({ mensaje: "Error cargando resumen del panel" });
  }
};



// src/controllers/panel.controller.js
const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");

// 🔹 Crear obra desde el panel (usa SP_RegistrarObraArte)
exports.crearObra = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      anio_creacion,
      dimensiones,
      urls,
      idArtista,
      idColeccion,
    } = req.body;

    // IMPORTANTE: los nombres deben coincidir con los parámetros del SP
    const result = await executeSP("SP_RegistrarObraArte", {
      titulo,
      descripcion,
      anio_creacion,
      dimensiones,
      idArtista,      // @idArtista
      idColeccion,    // @idColeccion
      urls,
    });

    return sendSpResponse(res, result);
  } catch (error) {
    console.error("Error registrando obra desde panel:", error);
    return res.status(500).json({
      ok: false,
      message: "Error registrando obra",
      error: error.message,
    });
  }
};
