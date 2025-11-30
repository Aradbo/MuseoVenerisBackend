// src/routes/metodoPago.routes.js

const express = require("express");
const router = express.Router();

const metodoPagoController = require("../controllers/metodoPago.Controller");

// GET ALL
router.get("/", metodoPagoController.getAll);

// GET BY ID
router.get("/:id", metodoPagoController.getById);

// CREATE
router.post("/", metodoPagoController.create);

// UPDATE
router.put("/:id", metodoPagoController.update);

// DELETE
router.delete("/:id", metodoPagoController.delete);

module.exports = router;

