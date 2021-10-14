const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../helpers/jwt");

const cookieOptions = {
  httpOnly: true,
  expires: 0,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  secure: process.env.NODE_ENV === "production" ? true : false,
};

module.exports = {
  login: async function (req, res, Model) {
    try {
      const email = req.body.email;
      const user = await Model.findOne({ email })
        .select("+password")
        .select("+refreshTokens");
      console.log(user);

      if (!user) {
        res.json({
          authenticated: false,
          msg: "Sorry, we can't find your profile, please register yourself",
        });
      } else {
        const verified = await bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (verified) {
          let deletedRT = false;
          if (user.refreshTokens.length >= 3) {
            Model.updateOne(
              { _id: user._id },
              { $set: { refreshTokens: [] } },
              (err, update) => {
                if (err || !update.nModified) {
                  console.log("More than 3 RT but failed deleting");
                } else {
                  console.log("More than 3 RT, so deleted all.");
                  deletedRT = true;
                }
              }
            );
          }

          const payload = {
            id: user._id,
          };
          const refreshToken = generateRefreshToken(payload);
          payload.email = user.email;
          const accessToken = generateAccessToken(payload);

          //   console.log(refreshToken, accessToken);

          if (req?.cookies?.refreshToken && !deletedRT) {
            Model.updateOne(
              { _id: user._id },
              { $pull: { refreshTokens: req.cookies.refreshToken } },
              (err, update) => {
                if (err || !update.nModified)
                  console.log("Error while deleting old refresh token");
                else console.log("Deleted old refresh token from DB");
              }
            );
          }

          Model.updateOne(
            { _id: user._id },
            { $push: { refreshTokens: refreshToken } },
            (err, update) => {
              if (err || !update.nModified) {
                console.log("Error while adding new refresh token");
                res.json({
                  authenticated: true,
                  msg: "Refresh token generation failed",
                });
              } else {
                console.log("Set Cookie for new Refresh Token");
                res.cookie("refreshToken", refreshToken, cookieOptions);
                res.json({
                  authenticated: true,
                  msg: "Login success",
                  accessToken,
                });
              }
            }
          );
        } else {
          res.json({ authenticated: false, msg: "Invalid Password" });
        }
      }
    } catch (err) {
      console.log(err);
      res.json({ authenticated: false, msg: "Failed Authenticating" });
    }
  },
  logout: function (req, res) {
    res.cookie("refreshToken", "", cookieOptions);
    res.json({ authenticated: false });
  },
};
