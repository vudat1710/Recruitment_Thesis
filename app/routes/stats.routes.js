var router = require("express").Router();
const stats = require("../controllers/stats.controller.js");
router.get("/getSalaryStats", stats.getSalaryStats); 
router.get("/getGenderStats", stats.getGenderStats);
router.get("/getJobTypeStats", stats.getJobTypeStats);
router.get("/getExperienceStats", stats.getExperienceStats);
router.get("/getMajorStats", stats.getMajorStats);
router.get("/getWorkPlaceStats", stats.getWorkPlaceStats);

module.exports = router;