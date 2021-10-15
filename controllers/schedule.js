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
  getByUser: async (req, res) => {
    try {
      let schedule;
      const { user } = jwt_decode(req.cookies.refreshToken);

      if (req.cookies.user) {
        schedule = await Schedule.find({ userId: user.id });
      } else {
        throw new Error("Please Log-In");
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
  getByDate: async (req, res) => {
    let availableTimings = [];
    const store = await Store.findById(req.body.storeId);
    const schedule = await Schedule.find({ ...req.body });

    const openTimeHour = parseInt(store.opens_at);
    const closeTimeHour = parseInt(store.closes_at);
    const maxAllowed = 8;

    for (let i = openTimeHour; i < closeTimeHour; i++) {
      availableTimings = [
        ...availableTimings,
        { slot: `${i}:00 - ${i + 1}:00`, count: maxAllowed },
      ];
    }

    schedule.forEach((s) => {
      const idx = parseInt(s.time) - openTimeHour;
      availableTimings[idx].count -= 1;
    });

    res.json({ timings: availableTimings });
  },
};