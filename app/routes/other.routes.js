var router = require("express").Router();
const other = require("../controllers/other.controller.js");
router.get("/getDataAutoComplete", other.getDataAutoComplete); 


module.exports = router;