var router = require("express").Router();
const workplaces = require("../controllers/workplace.controller.js");
router.post("/addWorkPlace", workplaces.addWorkPlace); 
router.post("/getWorkPlaceById", workplaces.getWorkPlaceById);
router.post("/getWorkPlaceByName", workplaces.getWorkPlaceByName);
router.post("/updateWorkPlace", workplaces.updateWorkPlace);
router.post("/deleteWorkPlace", workplaces.deleteWorkPlace);

module.exports = router;