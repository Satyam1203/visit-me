const bcrypt = require("bcrypt");
const User = require("../models/user");
const Store = require("../models/store");
const authController = require("./auth");

module.exports = {
  create: async (req, res) => {
    try {
      const userExists = await User.findOne({ email: req.body.email });
      const storeExists = await Store.findOne({ email: req.body.email });

      if (userExists || storeExists) {
        res.json({
          registered: false,
          msg: "This email is already registered with us. Try another",
        });
      } else {
        const password = await bcrypt.hash(req.body.password, 10);
        const store = await Store.create({
          ...req.body,
          password,
        });
        res.json({ registered: true });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  get: async (req, res) => {
    try {
      const store = await Store.find({ email: req.body.email });
      res.json(store);
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  login: (req, res) => authController.login(req, res, Store),
};
