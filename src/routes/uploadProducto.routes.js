const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { subirImagenProducto } = require("../controllers/uploadProducto.controller");

// CONFIGURACIÓN DE MULTER ============================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../uploads/productos"));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = Date.now()+"-"+Math.round(Math.random()*1E9)+ext;
        cb(null,name);
    }
});

// SOLO IMAGENES
function filter (req,file,cb){
    const allowed = ["image/png","image/jpeg","image/jpg","image/webp"];
    if(allowed.includes(file.mimetype)) cb(null,true);
    else cb(new Error("Formato no permitido"),false);
}

const upload = multer({ storage, fileFilter:filter });

// ENDPOINT PARA SUBIR IMAGEN ========================
router.post("/upload-producto", upload.single("imagen"), subirImagenProducto);

module.exports = router;
