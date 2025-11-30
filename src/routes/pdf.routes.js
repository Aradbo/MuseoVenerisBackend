const router = require("express").Router();
const { generarPDFPublico } = require("../controllers/pdf.controller");

// localhost:3000/api/pdf/publico/FM-00001
router.get("/publico/:codigoFactura", generarPDFPublico);

module.exports = router;
