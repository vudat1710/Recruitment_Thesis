var router = require("express").Router();
const passport = require('passport');
const other = require("../controllers/other.controller.js");
const wishlist = require("../controllers/wishlist.controller.js");
router.get("/getDataAutoComplete", other.getDataAutoComplete); 
router.post("/addToWishList", passport.authenticate('jwt', { session: false }), wishlist.addToWishList); 
router.post("/removeFromWishList", passport.authenticate('jwt', { session: false }), wishlist.removeFromWishList);
router.post("/getWishList", passport.authenticate('jwt', { session: false }), wishlist.getWishList);
router.post("/searchPostsByTitle", passport.authenticate('jwt', { session: false }), wishlist.searchPostsByTitle); 

module.exports = router;