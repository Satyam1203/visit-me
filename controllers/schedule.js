const jwt_decode = require("jwt-decode");

const Schedule = require("../models/schedule");
const User = require("../models/user");
const Store = require("../models/store");

module.exports = {
  create: async (req, res) => {
    try {
      const data = jwt_decode(req.cookies.refreshToken);
      console.log(req.body);
      if (req.cookies.user) {
        const { purpose, ...filterBy } = req.body;
        const clashingSchedules = await Schedule.find(filterBy);
        const store = await Store.findById(req.body.storeId);
        const userScheduleExists = await Schedule.find({
          userId: data.user.id,
          storeId: req.body.storeId,
          date: req.body.date,
          time: req.body.time,
        });

        if (userScheduleExists.length > 0) {
          res.json({
            error: "You already have an appointment at this time",
          });
        } else if (clashingSchedules.length >= store.max_allowed) {
          res.json({
            error: "This slot is full. Please try another date or time.",
          });
        } else {
          const schedule = await Schedule.create({
            ...req.body,
            userId: data.user.id,
          });
          res.json(schedule);
        }
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
    try {
      let availableTimings = [];
      const store = await Store.findById(req.body.storeId);
      const schedule = await Schedule.find({ ...req.body });

      const openTimeHour = parseInt(store.opens_at);
      const closeTimeHour = parseInt(store.closes_at);

      for (let i = openTimeHour; i < closeTimeHour; i++) {
        availableTimings = [
          ...availableTimings,
          { slot: `${i}:00 - ${i + 1}:00`, count: store.max_allowed },
        ];
      }

      schedule.forEach((s) => {
        const idx = parseInt(s.time) - openTimeHour;
        availableTimings[idx].count -= 1;
      });

      res.json({ timings: availableTimings });
    } catch (e) {
      res.json({ error: e.message });
    }
  },
  delete: async (req, res) => {
    try {
      const updateSchedule = await Schedule.updateOne(
        { _id: req.body.id },
        { active: false }
      );

      if (updateSchedule.nModified) {
        res.json({
          updated: updateSchedule.nModified,
          msg: "Deleted Successfully!",
        });
      } else {
        res.json({ updated: 0 });
      }
    } catch (e) {
      res.json({ error: e.message });
    }
  },
};
