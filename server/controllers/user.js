const User = require("../models/user");

module.exports = {
  create: async (req, res) => {
    try {
      const user = await User.create(req.body);
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
};
