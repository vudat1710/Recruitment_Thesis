var router = require("express").Router();
const passport = require('passport');
const action = require("../controllers/action.controller.js");
router.post("/getClick", passport.authenticate('jwt', { session: false }), action.getClick); 
router.post("/addActionType", action.addActionType); 
router.post("/updateActionType", action.updateActionType); 
router.post("/deleteActionType", action.deleteActionType);
router.post("/getActionTypeByName", action.getActionTypeByName); 
router.post("/getActionTypeById", action.getActionTypeById); 

module.exports = router;