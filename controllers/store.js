const jwt_decode = require("jwt-decode");
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
        res.json({
          registered: true,
          msg: "You're registered. Please Log-In.",
        });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  get: async (req, res) => {
    try {
      const store = await Store.find({ email: req.body.email, active: true });
      res.json(store);
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const stores = await Store.find({ active: true });
      res.json({ stores });
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  getCurrentStore: async (req, res) => {
    try {
      let store;
      const { user } = jwt_decode(req.cookies.refreshToken);

      if (req.cookies.store) {
        store = await Store.findOne({ _id: user.id, active: true });
      } else {
        throw new Error("Please Log-In as store");
      }

      if (!store) {
        res.json({ error: "Please try again", found: false });
      } else {
        res.json({ store });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  update: async (req, res) => {
    try {
      let updated;
      const { user } = jwt_decode(req.cookies.refreshToken);

      if (req.cookies.store) {
        updated = await Store.updateOne(
          { _id: user.id, active: true },
          {
            phone: req.body.phone,
            opens_at: req.body.opens_at,
            closes_at: req.body.closes_at,
            working_days: req.body.working_days,
            max_allowed: req.body.max_allowed,
          }
        );
      } else {
        throw new Error("Please Log-In as store");
      }

      if (updated.nModified) {
        res.json({ msg: "Your store details are updated.", updated: true });
      } else {
        res.json({ msg: "Failed Updating. Please try again", updated: false });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  delete: async (req, res) => {
    try {
      let deleted;
      const { user } = jwt_decode(req.cookies.refreshToken);

      if (req.cookies.store) {
        deleted = await Store.updateOne({ _id: user.id }, { active: false });
      } else {
        throw new Error("Please Log-In as store");
      }
      console.log(deleted);

      if (deleted.nModified) {
        res.clearCookie("refreshToken");
        if (req?.cookies?.store) res.clearCookie("store");

        res.json({
          deleted: true,
          msg: "Deleted Successfully!",
        });
      } else {
        res.json({ deleted: false });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  login: (req, res) => authController.login(req, res, Store),
};
