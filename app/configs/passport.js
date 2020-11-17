const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const db = require("../models");
const User = db.User;
const KEY = "vudat1710";

module.exports = passport => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: KEY
      },
      (jwtPayload, done) => {
        User.findOne({where: {userId: jwtPayload.userId}})
          .then((user) => {
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          })
          .catch(err => {
            console.log(err);
          });
      }
    )
  );
};