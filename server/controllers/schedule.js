const jwt_decode = require("jwt-decode");

const Schedule = require("../models/schedule");
const User = require("../models/user");
const Store = require("../models/store");

module.exports = {
  create: async (req, res) => {
    try {
      const data = jwt_decode(req.cookies.refreshToken);
      console.log(data);
      if (req.cookies.user) {
        const schedule = await Schedule.create({
          ...req.body,
          userId: data.user.id,
        });
        res.json(schedule);
      } else {
        res.json({
          error: "Only registered users can create an appointment",
        });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  getById: async (req, res) => {
    try {
      const schedule = await Schedule.findById(req.body.id);
      if (!schedule) {
        res.json({ found: false });
      } else {
        const user = await User.findById(schedule.userId);
        const store = await Store.findById(schedule.storeId);

        res.json({ schedule, user, store });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
};
