const { executeSP } = require("../utils/executeSP");
const { sendSpResponse } = require("../utils/sendSpResponse");

// ---------------- GET ALL ----------------
exports.getAll = async (req, res) => {
  const result = await executeSP("SP_Sucursal_Get");
  return sendSpResponse(res, result);
};
