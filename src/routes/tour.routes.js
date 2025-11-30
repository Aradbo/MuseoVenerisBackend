// src/routes/tour.routes.js

const express = require("express");
const router = express.Router();

const tourController = require("../controllers/tour.controller");

// GET ALL
router.get("/", tourController.getAll);

// GET BY ID
router.get("/:id", tourController.getById);

// CREATE
router.post("/", tourController.create);

// UPDATE
router.put("/:id", tourController.update);

// DELETE
router.delete("/:id", tourController.delete);


module.exports = router;


