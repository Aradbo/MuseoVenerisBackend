const { getConnection, sql } = require("../config/db");
const path = require("path");
const fs = require("fs");

// 📌 SUBIR / REEMPLAZAR IMAGEN DE OBRA
exports.subirImagenObra = async (req, res) => {
    try {
        const { id } = req.params;
        if(!req.file) return res.status(400).json({ mensaje:"No se envió imagen" });

        const nuevaRuta = `/uploads/obras/${req.file.filename}`;
        const pool = await getConnection();

        // 1️⃣ Obtener imagen anterior desde la BD
        const consulta = await pool.request()
            .input("id", sql.Int, id)
            .query(`SELECT urls FROM Obra_Arte WHERE idObra_Arte=@id`);

        const imagenAnterior = consulta.recordset[0]?.urls;

        // 2️⃣ Si existía imagen anterior → eliminar archivo físico
        if(imagenAnterior && fs.existsSync(path.join("src", imagenAnterior))){
            fs.unlinkSync(path.join("src", imagenAnterior));
        }

        // 3️⃣ Guardar nueva imagen en BD
        await pool.request()
            .input("id", sql.Int, id)
            .input("url", sql.VarChar(sql.MAX), nuevaRuta)
            .query(`
                UPDATE Obra_Arte 
                SET urls=@url 
                WHERE idObra_Arte=@id
            `);

        return res.json({ ok:true, mensaje:"Imagen actualizada con éxito", url:nuevaRuta });

    } catch(err) {
        console.error("❌ Error al subir imagen:", err);
        return res.status(500).json({ ok:false, mensaje:"Error guardando imagen" });
    }
};
