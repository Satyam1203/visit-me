const { generateRefreshToken, generateAccessToken } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const Model = require("../models/profile");
const mongoose = require("mongoose");

const refreshRT = (req, res, next) => {
  if (req.cookies.refreshToken) {
    jwt.verify(
      req.cookies.refreshToken,
      process.env.SECRET_RT_KEY,
      (err, payload) => {
        console.log(payload);
        if (err) {
          res.json({
            authenticated: false,
            msg: "Invalid Refresh token",
          });
        }

        Model.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(payload.user.id) },
          { $pull: { refreshTokens: req.cookies.refreshToken } },
          (err, user) => {
            if (err || !user) {
              res.json({
                authenticated: false,
                msg: "Invalid token(user)",
              });
            } else {
              console.log("Old refresh token deleted");
              const payload = {
                id: user._id,
              };
              const refreshToken = generateRefreshToken(payload);
              payload.email = user.email;
              const accessToken = generateAccessToken(payload);

              // console.log(refreshToken, accessToken);

              const cookieOptions = {
                httpOnly: true,
                expires: 0,
                sameSite:
                  process.env.NODE_ENV === "production" ? "none" : "Lax",
                secure: process.env.NODE_ENV === "production" ? true : false,
              };

              Model.updateOne(
                { _id: user._id },
                { $push: { refreshTokens: refreshToken } },
                (err, update) => {
                  if (err || !update.nModified) {
                    console.log("Error while adding new refresh token");
                    res.json({
                      authenticated: true,
                      msg: "Refresh token generation failed",
                      accessToken,
                    });
                  } else {
                    console.log("Set Cookie for new Refresh Token");
                    res.cookie("refreshToken", refreshToken, cookieOptions);
                    res.json({
                      authenticated: true,
                      msg: "Authorized",
                      accessToken,
                    });
                  }
                }
              );
            }
          }
        );
      }
    );
  } else {
    res.json({
      authenticated: false,
      msg: "Refresh token DNE",
    });
  }
};

module.exports = refreshRT;
