const passport = require("passport");
const refreshRT = require("./refreshTokenRegeneration");

const authenticate = (req, res, next, Model) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) res.json({ authenticated: false, msg: "Failed authenticating" });
    if (!user) {
      refreshRT(req, res, next, Model);
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

module.exports = authenticate;
