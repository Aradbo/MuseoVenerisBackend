const path = require("path");
const fs = require("fs");

exports.subirImagenProducto = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ ok:false, message:"No se recibió ninguna imagen" });
    }

    const filename = req.file.filename;
    const url = `/uploads/productos/${filename}`; // <- esto se guarda en BD

    return res.status(200).json({
        ok:true,
        message:"Imagen cargada correctamente",
        file: filename,
        urlImagen: url
    });
};


