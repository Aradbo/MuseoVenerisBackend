const router = require("express").Router();
const facturaPublic = require("../controllers/facturaPublic.controller");

// POST FACTURACIÓN PARA VISITANTE
router.post("/registrar-publico", facturaPublic.registrarFacturaPublico);
router.get("/validar/:codigoFactura", facturaPublic.validarFactura);

module.exports = router;
