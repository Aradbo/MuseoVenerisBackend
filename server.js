const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");


const { getConnection } = require("./src/config/db");

const app = express();
app.use(cors());
app.use(express.json());

//Rutas para probar la conexión
const personaRoutes = require("./src/routes/persona.routes");
app.use("/api/personas", personaRoutes);

const visitanteRoutes = require("./src/routes/visitante.routes");
app.use("/api/visitantes", visitanteRoutes);

const empleadoRoutes = require("./src/routes/empleado.routes");
app.use("/api/empleados", empleadoRoutes);

const artistaRoutes = require("./src/routes/artista.routes");
app.use("/api/artistas", artistaRoutes);

const obraRoutes = require("./src/routes/obraArte.routes");
app.use("/api/obras", obraRoutes);
//Rutas para imagenes de obras
const obraImagenRoutes = require("./src/routes/obraImagen.routes");
app.use("/api/obras-imagen", obraImagenRoutes);


const exposicionRoutes = require("./src/routes/exposicion.routes");
app.use("/api/exposiciones", exposicionRoutes);

const obraExposicionRoutes = require("./src/routes/obraExposicion.routes");
app.use("/api/obra-exposicion", obraExposicionRoutes);

const productoRoutes = require("./src/routes/producto.routes");
app.use("/api/productos", productoRoutes);

const metodoPagoRoutes = require("./src/routes/metodoPago.routes");
app.use("/api/metodos-pago", metodoPagoRoutes);

const tourRoutes = require("./src/routes/tour.routes");
app.use("/api/tours", tourRoutes);

const facturaRoutes = require("./src/routes/factura.routes");
app.use("/api/facturas", facturaRoutes);

const salaRoutes = require("./src/routes/sala.routes");
app.use("/api/salas", salaRoutes);

const edificioRoutes = require("./src/routes/edificio.routes");
app.use("/api/edificios", edificioRoutes);

const sucursalRoutes = require("./src/routes/sucursal.routes");
app.use("/api/sucursales", sucursalRoutes);

const privilegioRoutes = require("./src/routes/privilegio.routes");
app.use("/api/privilegios", privilegioRoutes);

const impuestoRoutes = require("./src/routes/impuesto.routes");
app.use("/api/impuestos", impuestoRoutes);

const categoriaRoutes = require("./src/routes/categoriaImpuesto.routes");
app.use("/api/categorias", categoriaRoutes);


const facturaImpuestoRoutes = require("./src/routes/facturaImpuesto.routes");
app.use("/api/factura-impuestos", facturaImpuestoRoutes);


const descuentoRoutes = require("./src/routes/descuento.routes");
app.use("/api/descuentos", descuentoRoutes);


const facturaDescuentoRoutes = require("./src/routes/facturaDescuento.routes");
app.use("/api/factura-descuentos", facturaDescuentoRoutes);


const precioRoutes = require("./src/routes/precio.routes");
app.use("/api/precios", precioRoutes);


const lugarRoutes = require("./src/routes/lugar.routes");
app.use("/api/lugares", lugarRoutes);


const registroVisitanteRoutes = require("./src/routes/registroVisitante.routes");
app.use("/api/registro-visitante", registroVisitanteRoutes);

const authRoutes = require("./src/routes/auth.routes");
app.use("/api/auth", authRoutes);

const facturaPublicRoutes = require("./src/routes/facturaPublic.routes");
app.use("/api/facturas-publico", facturaPublicRoutes);

const pdfRoutes = require("./src/routes/pdf.routes");
app.use("/api/pdf", pdfRoutes);

//Ruta para las vistas vistas
const vistasRoutes = require("./src/routes/vistas.routes");
app.use("/api/vistas", vistasRoutes);

//Ruta para el panel de administración
const panelRoutes = require("./src/routes/panel.routes");
app.use("/api/panel", panelRoutes);
//Ruta para el panel de administración - obras
const obrasPanelRoutes = require("./src/routes/obrasPanel.routes");
app.use("/api/panel/obras", obrasPanelRoutes);


const uploadProductoRoutes = require("./src/routes/uploadProducto.routes");

app.use("/api/uploads", uploadProductoRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Habilitar acceso a carpeta pública
app.use("/uploads", express.static("src/uploads"));

app.use("/uploads", express.static(path.join(__dirname,"uploads")));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log("🔥 API Museo Veneris corriendo en puerto", process.env.PORT);
});
