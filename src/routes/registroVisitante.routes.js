// src/routes/registroVisitante.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/registroVisitante.controller");

router.post("/", ctrl.registrarVisitante);

module.exports = router;
