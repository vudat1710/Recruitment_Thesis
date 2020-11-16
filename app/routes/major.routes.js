var router = require("express").Router();
const majors = require("../controllers/major.controller.js");
router.post("/addMajor", majors.addMajor); 
router.post("/getMajorById", majors.getMajorById);
router.post("/getMajorByName", majors.getMajorByName);
router.post("/updateMajor", majors.updateMajor);
router.post("/deleteMajor", majors.deleteMajor);

module.exports = router;