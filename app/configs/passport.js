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
              console.log(user.is_lock)
              if (user.is_lock === 0) {
                return done(null, user);
              } else {
                return done(null, false);
              }
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