const express = require("express");
const router = express.Router();
const controller = require("../controllers/producto.controller");
const { actualizarImagenProducto } = require("../controllers/producto.controller");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/search/texto", controller.search);
router.post("/", controller.create);
router.put("/", controller.update);
router.delete("/:id", controller.delete);

const upload = require("../middleware/uploadProducto");
router.post("/upload-imagen/:idProducto", upload.single("imagen"), actualizarImagenProducto);

module.exports = router;
