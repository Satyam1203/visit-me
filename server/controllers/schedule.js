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
  get: async (req, res) => {
    try {
      let schedule;
      if (req.params.filter === "id") {
        schedule = await Schedule.findById(req.body.id);
      } else {
        const { user } = jwt_decode(req.cookies.refreshToken);

        if (req.cookies.user) {
          schedule = await Schedule.find({ userId: user.id });
        }
      }

      if (!schedule) {
        res.json({ found: false });
      } else {
        schedule = await Promise.all(
          schedule.map(async (appt) => {
            const store = await Store.findById(appt.storeId);

            return { ...appt._doc, store };
          })
        );

        res.json({ schedule });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
};
