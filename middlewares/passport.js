const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/user");
const Store = require("../models/store");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY || "12e";

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ _id: jwt_payload.user.id });
      const store = await Store.findOne({ _id: jwt_payload.user.id });

      if (user) return done(null, user);
      else if (store) return done(null, store);
      else return done(null, false);
    } catch (e) {
      return done(e, false);
    }
  })
);

module.exports = passport;
