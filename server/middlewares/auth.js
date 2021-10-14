const passport = require("passport");
const refreshRT = require("./refreshTokenRegeneration");

const User = require("../models/user");
const Store = require("../models/store");

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) res.json({ authenticated: false, msg: "Failed authenticating" });
    if (!user) {
      if (req.cookies.store) refreshRT(req, res, next, Store);
      else if (req.cookies.user) refreshRT(req, res, next, User);
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

module.exports = authenticate;
