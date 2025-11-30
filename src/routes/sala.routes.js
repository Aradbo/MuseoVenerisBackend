const express = require("express");
const router = express.Router();
const salaCtrl = require("../controllers/sala.controller");

router.get("/", salaCtrl.getAll);
router.get("/search", salaCtrl.search);
router.get("/:id", salaCtrl.getById);
router.post("/", salaCtrl.create);
router.put("/", salaCtrl.update);
router.delete("/:id", salaCtrl.delete);

module.exports = router;
