const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crear carpeta si no existe
const uploadPath = path.join(__dirname, "../../uploads/productos");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Configuración Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random()*9999) + ext;
    cb(null, name);
  }
});

function fileFilter(req,file,cb){
  const allowed = ["image/jpeg","image/png","image/jpg","image/webp"];
  if(!allowed.includes(file.mimetype)) return cb(new Error("Archivo no permitido"),false);
  cb(null,true);
}

module.exports = multer({storage,fileFilter,limits:{fileSize:5*1024*1024}}); //5MB
