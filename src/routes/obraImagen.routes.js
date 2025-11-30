const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { subirImagenObra } = require("../controllers/obraImagen.controller");

// === almacenamiento ===
const storage = multer.diskStorage({
    destination:"uploads/obras",
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname.replace(/\s+/g,"_"));
    }
});

const upload = multer({ storage });

// 📌 subir imagen (NO rompe SP existente)
router.post("/subir/:id", upload.single("imagen"), subirImagenObra);

module.exports = router;
