const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");

router.post("/login", ctrl.login);
router.post("/loginGoogle", ctrl.loginGoogle);
router.post("/registroVisitante", ctrl.registroVisitante); 

module.exports = router;
