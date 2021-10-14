const bcrypt = require("bcrypt");
const User = require("../models/user");
const authController = require("./auth");

module.exports = {
  create: async (req, res) => {
    try {
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password,
      });
      res.json(user);
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  get: async (req, res) => {
    try {
      const user = await User.find({ email: req.body.email });
      res.json(user);
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  login: (req, res) => authController.login(req, res, User),
};
