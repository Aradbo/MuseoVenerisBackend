const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { getConnection } = require("../config/db");

exports.generarPDFPublico = async (req, res) => {
  try {
    const codigo = req.params.codigoFactura;
    const pool = await getConnection();

    // ================== FACTURA ==================
    const queryFactura = await pool.request()
      .input("codigo", codigo)
      .query(`
        SELECT TOP 1 f.idFactura,f.codigo_factura,f.fecha_emision,
        f.total,f.total_impuesto,f.total_descuento,
        CONCAT(p.primer_nombre,' ',ISNULL(p.segundo_nombre,''),' ',
        p.primer_apellido,' ',ISNULL(p.segundo_apellido,'')) AS visitante,
        pr.tipo_tarifa,pr.precio AS precio_tarifa
        FROM Factura f
        JOIN Visitante_has_Factura v ON v.Factura_idFactura=f.idFactura
        JOIN Visitante vi ON vi.idVisitante=v.Visitante_idVisitante
        JOIN Persona p ON p.idPersona=vi.Persona_idPersona
        JOIN Precio pr ON pr.idPrecio=v.Precio_idPrecio
        WHERE f.codigo_factura=@codigo
      `);

    if (!queryFactura.recordset.length) {
      return res.status(404).send("Factura no encontrada");
    }
    const f = queryFactura.recordset[0];

    // ================== DETALLES ==================
    const productos = await pool.request().input("id", f.idFactura)
      .query(`
        SELECT df.Cantidad, p.nombre, df.subtotal
        FROM Detalle_Factura df
        JOIN Producto p ON p.idProducto = df.Producto_idProducto
        WHERE df.Factura_idFactura = @id
      `);

    const tours = await pool.request().input("id", f.idFactura)
      .query(`
        SELECT ft.cantidad, (ft.cantidad * ${f.precio_tarifa}) AS subtotal,
               t.idTour, t.fecha_hora_inicio
        FROM Factura_has_Tour ft
        JOIN Tour t ON t.idTour = ft.Tour_idTour
        WHERE ft.Factura_idFactura = @id
      `);

// ================== CÁLCULOS ==================
let subtotalDetalles = 0;

productos.recordset.forEach(p => subtotalDetalles += Number(p.subtotal) || 0);
tours.recordset.forEach(t => subtotalDetalles += Number(t.subtotal) || 0);

// 1) Obtener impuestos asociados a la factura (si existen)
const queryImpuestos = await pool.request()
  .input("id", f.idFactura)
  .query(`
      SELECT i.porcentaje
      FROM Factura_Impuesto fi
      JOIN Impuesto i ON i.idImpuesto = fi.Impuesto_idImpuesto
      WHERE fi.Factura_idFactura=@id
        AND (i.fecha_fin IS NULL OR i.fecha_fin >= GETDATE())
  `);

let impuesto = 0;
queryImpuestos.recordset.forEach(im => impuesto += subtotalDetalles * im.porcentaje);


// 2) Obtener descuento aplicado directamente a la factura
const queryDescuento = await pool.request()
  .input("id", f.idFactura)
  .query(`
      SELECT d.porcentaje 
      FROM Factura_Descuento fd
      JOIN Descuento d ON d.idDescuento = fd.Descuento_idDescuento
      WHERE fd.Factura_idFactura=@id
        AND d.estado='A'
        AND (d.fecha_fin IS NULL OR d.fecha_fin >= GETDATE())
  `);

let descuento = 0;
if(queryDescuento.recordset.length > 0){
    const porcDesc = queryDescuento.recordset[0].porcentaje;
    descuento = subtotalDetalles * porcDesc;
}


// 3) Total real
const subtotal = subtotalDetalles;
const total = subtotal + impuesto - descuento;


    const QR = await QRCode.toDataURL(
      `http://localhost:3000/verificar/${f.codigo_factura}`
    );

    const logoPath = path.join(__dirname, "../assets/logo-museo-veneris.png");

    // ================== PDF ==================
    const doc = new PDFDocument({ margin: 40, size: "LETTER" });
    doc.pipe(res);

    // ================= HEADER PREMIUM =================
    doc.rect(0,0,612,160).fill("#000");
if(fs.existsSync(logoPath)) doc.image(logoPath,230,20,{width:115});

doc.fillColor("#FACC15").fontSize(26).font("Helvetica-Bold")
   .text("MUSEO VENERIS",0,120,{align:"center"});
doc.fillColor("#E8E8E8").fontSize(12)
   .text("Factura Electrónica Oficial",0,145,{align:"center"});

doc.y = 190;


    // ================= DATOS FACTURA =================
    // Título sección

doc.fillColor("#CBA135")
   .font("Helvetica-Bold")
   .fontSize(15)
   .text("    Datos de la Factura", { align:"left" });

doc.moveDown(1);
    doc.fillColor("#111").fontSize(12);
    doc.text(`    Código:        ${f.codigo_factura}`);
    doc.text(
      `    Fecha emisión: ${new Date(f.fecha_emision).toLocaleString("es-HN")}\n`
    );
    doc.text(`    Visitante:     ${f.visitante}`);
    doc.text(
      `    Tarifa aplicada: ${f.tipo_tarifa} — L ${f.precio_tarifa.toFixed(2)}`
    );
    doc.moveDown(2.2);

    // ================= TABLA PREMIUM =================
    doc.fontSize(16)
      .fillColor("#D4AF37")
      .text("        Detalles de compra", { underline: true });

    doc.moveDown(1);

    const startY = doc.y + 10;
    const colConcepto = 60;
    const colCant = 350;
    const colSub = 430;

    doc.fontSize(12).fillColor("#CBA135");
    doc.text("Concepto", colConcepto, startY);
    doc.text("Cant", colCant, startY);
    doc.text("Subtotal", colSub, startY);

    doc.moveTo(colConcepto, startY + 15)
      .lineTo(550, startY + 15)
      .stroke("#CBA135");

    let y = startY + 25;
    doc.fontSize(11);

    productos.recordset.forEach((p, i) => {
      doc.fillColor(i % 2 === 0 ? "#444" : "#CBA135");
      doc.text(p.nombre, colConcepto, y);
      doc.text(p.Cantidad.toString(), colCant, y);
      doc.text(`L ${Number(p.subtotal || 0).toFixed(2)}`, colSub, y);
      y += 22;
    });

    tours.recordset.forEach((t, i) => {
      doc.fillColor(i % 2 === 0 ? "#444" : "#CBA135");
      doc.text(
        `Tour #${t.idTour} (${new Date(
          t.fecha_hora_inicio
        ).toLocaleDateString()})`,
        colConcepto,
        y
      );
      doc.text(String(t.cantidad), colCant, y);
      doc.text(`L ${Number(t.subtotal || 0).toFixed(2)}`, colSub, y);
      y += 22;
    });

    doc.moveDown(3);

    // ================= TOTAL BOX =================
    doc.roundedRect(310, doc.y, 250, 110, 10)
      .fillOpacity(0.18)
      .fill("#9de1eaff")
      .stroke("#35c1cbff");

    doc.fillColor("#000")
      .fontSize(13)
      .text(`Subtotal: L ${subtotal.toFixed(2)}`, 330, doc.y + 8);
    doc.text(`Impuestos: L ${impuesto.toFixed(2)}`, 330);
    // aquí ya lo mostramos como descuento restado
    doc.text(`Descuento: - L ${descuento.toFixed(2)}`, 330);

    doc.fontSize(20)
      .fillColor("#000000ff")
      .text(`TOTAL: L ${total.toFixed(2)}`, 330, doc.y + 18);

    doc.moveDown(4);

    // ================= QR + SELLO =================
    doc.fillColor("#CBA135").fontSize(14).text("Validación Oficial", 40);
    doc.image(QR, 40, doc.y + 10, { width: 140 });
    doc.fillColor("#777")
      .fontSize(10)
      .text("Escanear para validar autenticidad", { align: "left" });

    doc.moveDown(2);

    doc.fontSize(9)
      .fillColor("#999")
      .text("© Museo Veneris — Documento legal certificado", {
        align: "center",
      });

    doc.end();
  } catch (e) {
    console.log("PDF ERROR PREMIUM ❌", e);
    return res.status(500).send("Error generando PDF");
  }
};
