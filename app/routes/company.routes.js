var router = require("express").Router();
const companies = require("../controllers/company.controller.js");
router.post("/addCompany", companies.addCompany); 
router.post("/getCompanyById", companies.getCompanyById);
router.post("/getCompanyByName", companies.getCompanyByName);
router.post("/updateCompany", companies.updateCompany);
router.post("/deleteCompany", companies.deleteMajor);

module.exports = router;