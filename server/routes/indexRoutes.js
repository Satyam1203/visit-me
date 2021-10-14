let routes = require("express").Router(),
  mongoose = require("mongoose");

// Database models
let Detail = require("../models/user");
let Schedule = require("../models/schedule");

// Shop closing and opening times
let OPEN_TIME_HR = 9,
  CLOSE_TIME_HR = 18,
  MAX_ALLOWED = 8;

// Add appointment route
routes.post("/add-appt", (req, res) => {
  name = req.body.name;
  purpose = req.body.purpose;
  aDate = req.body.date;
  aTime = req.body.time;
  phone = req.body.phone;
  email = req.body.email;
  // console.log(name, aDate, aTime, email);
  hour = Number(aTime.slice(0, 2));
  // console.log(hour);
  if (hour < OPEN_TIME_HR || hour >= CLOSE_TIME_HR) {
    res.json({
      err: "Shop is closed at this time.. Please try another",
    });
    return;
  }
  Schedule.findOneAndUpdate(
    {
      Date: aDate,
      stTime: `${aTime.slice(0, 3)}00`,
      enTime: `${Number(aTime.slice(0, 2)) + 1}:00`,
    },
    {
      $inc: { count: 1 },
    },
    (err, schedule) => {
      if (err)
        res.status(404).json({ err: "Error while adding schedule, count+=1" });
      else if (!schedule) {
        Schedule.create({
          Date: aDate,
          stTime: `${aTime.slice(0, 3)}00`,
          enTime: `${Number(aTime.slice(0, 2)) + 1}:00`,
          count: 1,
        });
        addDetailAndMail(name, purpose, aDate, aTime, phone, email, res);
      } else {
        // console.log(schedule)
        if (schedule.count >= MAX_ALLOWED) {
          res.json({ err: "Cannot be alloted! Slot full" });
        } else {
          addDetailAndMail(name, purpose, aDate, aTime, phone, email, res);
        }
      }
    }
  );
});

// Find appointment with email id
routes.post("/show-appt", (req, res) => {
  email = req.body.email;
  Detail.find(
    {
      email,
    },
    (err, detail) => {
      if (err)
        res
          .status(404)
          .json({ err: "Error while displaying your appointments" });
      else if (detail.length === 0)
        res.json({ err: "No appointments exist for this email id" });
      else {
        res.json({ detail });
      }
    }
  );
});

// Cancel my appointment
routes.post("/remove-appt/:id", (req, res) => {
  id = mongoose.Types.ObjectId(`${req.params.id}`);
  Detail.findOneAndDelete(
    {
      _id: id,
    },
    (err, dt) => {
      if (err) res.status(404).json({ err: "Error while removing detail" });
      else {
        time = `${dt.aTime.slice(0, 2)}:00`;
        Schedule.findOneAndUpdate(
          {
            stTime: time,
            Date: dt.aDate,
          },
          {
            $inc: { count: -1 },
          },
          (err, schedule) => {
            if (schedule.count === 1) {
              console.log(schedule._id);
              Schedule.deleteOne(
                { _id: mongoose.Types.ObjectId(`${schedule._id}`) },
                (err, dt) => {
                  if (err)
                    res.status(404).json({ err: "Failed deleting schedule" });
                }
              );
            }
            if (err) res.status(404).json({ err: "Error while count-=1" });
            else if (!schedule)
              res.json({ err: "Could not remove appointment now" });
            else {
              res.json({ msg: "Appointment cancelled successfully" });
            }
          }
        );
      }
    }
  );
});

// See number of available appointment for a given date in each slot
routes.post("/schedule", (req, res) => {
  date = req.body.date;
  availableTimings = [];
  Schedule.find(
    {
      Date: date,
    },
    (err, schedule) => {
      if (err) res.status(404).json({ err: "Error occured" });
      for (let i = OPEN_TIME_HR; i < CLOSE_TIME_HR; i++) {
        availableTimings = [
          ...availableTimings,
          { slot: `${i}:00 - ${i + 1}:00`, count: MAX_ALLOWED },
        ];
      }
      schedule.forEach((sc) => {
        const idx = parseInt(sc.stTime) - OPEN_TIME_HR;
        availableTimings[idx].count -= sc.count;
      });
      res.json({ timings: availableTimings });
    }
  );
});

// Add Detail to the database and consequently send a mail to them
const addDetailAndMail = (name, purpose, aDate, aTime, phone, email, res) => {
  Detail.create(
    {
      name,
      purpose,
      aDate,
      aTime,
      phone,
      email,
    },
    async (err, dt) => {
      if (err) res.status(404).json({ err: "Error while adding detail" });
      else {
        console.log("=============here===================");
        console.log(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: [email, "thesarcastics123@gmail.com"],
          from: "no-reply@visit-me.vercel.app",
          subject: "Reminder- Shop visit",
          text: `You can visit our store at  your preferred timing`,
          html: `<p>Dear ${
            dt.name
          }, <br/>You can visit our store at the following given time. Our best service is here for your help. Do visit on time. </p>
                    <p>Date: <strong>${dt.aDate}</strong></p>
                    <p>Time: <strong>${dt.aTime.slice(0, 3)}00 - ${
            Number(dt.aTime.slice(0, 2)) + 1
          }:00</strong></p>
                    `,
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
        res.json(dt);
      }
    }
  );
};

module.exports = routes;
