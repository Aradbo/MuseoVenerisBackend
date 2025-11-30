const express = require("express");
const router = express.Router();
const edificioCtrl = require("../controllers/edificio.controller");

router.get("/", edificioCtrl.getAll);
router.get("/search", edificioCtrl.search);
router.get("/:id", edificioCtrl.getById);
router.post("/", edificioCtrl.create);
router.put("/", edificioCtrl.update);
router.delete("/:id", edificioCtrl.delete);

module.exports = router;
