// Dependencies
let express = require('express'),
    app = express(),
    cors = require('cors'),
    mongoose = require('mongoose');

let Detail = require('./db_model/appt_detail');
let Schedule = require('./db_model/appt_schedule');

// Configure .env file
require('dotenv').config();

// Connecting to database
require('./db_model/connect')();

// Middleware function
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req,res)=>{res.send("helllo")})
app.post("/add-appt", (req,res)=>{
    name=req.body.name;
    purpose=req.body.purpose;
    aDate=req.body.date;
    aTime=req.body.time;
    Schedule.findOneAndUpdate({
        Date: aDate,
        stTime: `${aTime.slice(1,4)}00`,
        enTime: `${Number(aTime.slice(1,4))+1}00`
    }, {
        $inc: {count:1}
    }
    ,(err, schedule)=>{
        if(err) res.status(404).json({err:"Error while count+=1"});
        else if(!schedule){
            Schedule.create({
                Date: aDate,
                stTime: `${aTime.slice(1,4)}00`,
                enTime: `${Number(aTime.slice(1,4))+1}00`,
                count:1
            })
            Detail.create({
                name, purpose, aDate, aTime
            }, (err, dt)=>{
                if(err) res.status(404).json({err: "Error while adding detail"});
                else res.json(dt);
            })
        }
        else {
            // console.log(schedule)
            if(schedule.count >= 5){
                res.json({err: "Cannot be alloted! Slot full"})
            }else{
                Detail.create({
                    name, purpose, aDate, aTime
                }, (err, dt)=>{
                    if(err) res.status(404).json({err: "Error while adding detail"});
                    else res.json(dt);
                })
            }
        }
    })
})

// For non-existing routes
app.use((req,res)=>res.status(404).send("Not found"));

// Activate the server
app.listen(process.env.PORT,()=>{
    console.log(`Listening at ${process.env.PORT}`);
});