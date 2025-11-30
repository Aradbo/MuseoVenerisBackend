function sendSpResponse(res, result) {
  const { ok, data, output } = result;

  if (!ok) {
    return res.status(500).json({
      ok: false,
      message: "Error ejecutando SP",
      error: result.message
    });
  }

  // cuando el SP usa @TipoMensaje y @Mensaje
  if (output?.TipoMensaje !== undefined) {
    return res.json({
      ok: output.TipoMensaje === 0,
      mensaje: output.Mensaje,
      data
    });
  }

  // cuando el SP solo devuelve datos
  return res.json({
    ok: true,
    data
  });
}

module.exports = { sendSpResponse };
