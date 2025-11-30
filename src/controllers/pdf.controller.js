const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { getConnection } = require("../config/db");

exports.generarPDFPublico = async (req, res) => {
  try {
    const codigo = req.params.codigoFactura;
    if (!codigo) return res.status(400).end("Código requerido");

    const pool = await getConnection();

    // ================== GET FACTURA ==================
    const result = await pool.request()
      .input("codigo", codigo)
      .query(`
        SELECT TOP 1
          f.idFactura, f.codigo_factura, f.fecha_emision,
          f.total, f.total_impuesto, f.total_descuento,
          CONCAT(p.primer_nombre,' ',ISNULL(p.segundo_nombre,''),' ',
                 p.primer_apellido,' ',ISNULL(p.segundo_apellido,'')) AS visitante,
          pr.tipo_tarifa, pr.precio AS precio_tarifa
        FROM Factura f
        JOIN Visitante_has_Factura vhf ON vhf.Factura_idFactura=f.idFactura
        JOIN Visitante v ON v.idVisitante=vhf.Visitante_idVisitante
        JOIN Persona p ON p.idPersona=v.Persona_idPersona
        JOIN Precio pr ON pr.idPrecio=vhf.Precio_idPrecio
        WHERE f.codigo_factura=@codigo
      `);

    if (!result.recordset.length) return res.status(404).end("Factura no encontrada");

    const f = result.recordset[0];

    // 🔥 URL + QR
    const verifyURL = `http://localhost:3000/verificar/${f.codigo_factura}`;
    const QR = await QRCode.toDataURL(verifyURL);

    // ================== PRODUCTOS ==================
    const productos = await pool.request()
      .input("id", f.idFactura)
      .query(`
        SELECT df.Cantidad, p.nombre, df.subtotal
        FROM Detalle_Factura df
        JOIN Producto p ON p.idProducto=df.Producto_idProducto
        WHERE df.Factura_idFactura=@id
      `);

    // ================== TOURS (subtotal calculado) ==================
    const tours = await pool.request()
      .input("id", f.idFactura)
      .query(`
        SELECT ft.cantidad, (ft.cantidad * ${f.precio_tarifa}) AS subtotal,
               t.idTour, t.fecha_hora_inicio
        FROM Factura_has_Tour ft
        JOIN Tour t ON t.idTour = ft.Tour_idTour
        WHERE ft.Factura_idFactura=@id
      `);

    // ======== CREACIÓN PDF — ESTA ES LA VERSIÓN ESTABLE ========
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${f.codigo_factura}.pdf"`);

    const doc = new PDFDocument({ margin:40 });
    const stream = doc.pipe(res);   // <--- iniciar flujo

    // ==========================================
// 📄 HEADER PROFESIONAL
// ==========================================
doc.fillColor("#000"); // fondo blanco
doc.rect(0, 0, 600, 120).fill("#0B0B0C");
if (fs.existsSync(logoPath)) doc.image(logoPath, 230, 25, { width:140 });

doc.fillColor("#FACC15").fontSize(18).text("Museo Veneris", { align:"center", baseline:"middle" });
doc.fillColor("#E5E5E5").fontSize(10).text("Factura electrónica oficial", { align:"center" });
doc.moveDown(3);

// ==========================================
// 🧾 DATOS PRINCIPALES
// ==========================================
doc.fontSize(11).fillColor("#333");
doc.text(`Factura:        ${f.codigo_factura}`);
doc.text(`Fecha emisión:  ${new Date(f.fecha_emision).toLocaleString("es-HN")}`);
doc.text(`Visitante:      ${f.visitante}`);
doc.text(`Tarifa aplicada: ${f.tipo_tarifa} (L ${(f.precio_tarifa).toFixed(2)})`);
doc.moveDown(2);

// ==========================================
// TABLA DE PRODUCTOS & TOURS
// ==========================================
doc.fontSize(13).fillColor("#CBA135").text("Detalles de compra");
doc.moveDown(0.8);

doc.fontSize(10).fillColor("#444").text("┌───────────────────────────────────────────────┬──────┬────────────┐");
doc.text("│ CONCEPTO                                      │ CANT │ SUBTOTAL   │");
doc.text("├───────────────────────────────────────────────┼──────┼────────────┤");

productos.recordset.forEach(p=>{
  doc.text(`│ ${p.nombre.padEnd(45)} │ ${String(p.Cantidad).padStart(4)} │ L ${(Number(p.subtotal)||0).toFixed(2).padStart(8)} │`);
});

tours.recordset.forEach(t=>{
  doc.text(`│ Tour #${t.idTour} - ${new Date(t.fecha_hora_inicio).toLocaleDateString()}│ ${String(t.cantidad).padStart(4)} │ L ${(Number(t.subtotal)||0).toFixed(2).padStart(8)} │`);
});

doc.text("└───────────────────────────────────────────────┴──────┴────────────┘");
doc.moveDown(2);

// ==========================================
// 📌 TOTALES VISUALES
// ==========================================
doc.fontSize(12).fillColor("#333");
doc.text(`Subtotal:                        L ${subtotal.toFixed(2)}`);
doc.text(`Impuestos:                       L ${impuesto.toFixed(2)}`);
doc.text(`Descuentos aplicados:          - L ${descuento.toFixed(2)}`);
doc.moveDown(0.8);

doc.fontSize(18).fillColor("#CBA135").text(`TOTAL FINAL: L ${total.toFixed(2)}`, { align:"right" });
doc.moveDown(2);

// ==========================================
// 🔐 SELLO DIGITAL + QR
// ==========================================
doc.fontSize(11).fillColor("#CBA135").text("Autenticidad verificada digitalmente");
doc.image(QR, 400, doc.y, { width:120 });
doc.moveDown(5);

doc.fillColor("#777").fontSize(8).text("Sistema validado — Museo Veneris © 2025",{align:"center"});
doc.text("Escanea QR para validar este documento",{align:"center"});

// END PDF
doc.end();


    // 🔥 CONTROL SEGURO PARA FINALIZAR STREAM
    stream.on("finish",()=> console.log("PDF enviado ✔"));
    stream.on("error",err=> console.log("PDF error ❌",err));

  } catch (err) {
    console.log("ERROR PDF:",err);
    if (!res.headersSent) res.status(500).send("Error generando PDF");
  }
};
