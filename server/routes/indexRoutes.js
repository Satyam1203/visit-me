let routes = require('express').Router();

// Database models
let Detail = require('../db_model/appt_detail');
let Schedule = require('../db_model/appt_schedule');

// Shop closing and opening times
let OPEN_TIME_HR = 9,
    CLOSE_TIME_HR = 18;

routes.post("/add-appt", (req,res)=>{
    name=req.body.name;
    purpose=req.body.purpose;
    aDate=req.body.date;
    aTime=req.body.time;
    hour=Number(aTime.slice(0,2));
    // console.log(hour);
    if( hour < OPEN_TIME_HR || hour >= CLOSE_TIME_HR ){
        res.json({
            err: "Shop is closed at this time.. Please try another",
        })
        return;
    }
    Schedule.findOneAndUpdate({
        Date: aDate,
        stTime: `${aTime.slice(0,3)}00`,
        enTime: `${Number(aTime.slice(0,2))+1}:00`
    }, {
        $inc: {count:1}
    }
    ,(err, schedule)=>{
        if(err) res.status(404).json({err:"Error while count+=1"});
        else if(!schedule){
            Schedule.create({
                Date: aDate,
                stTime: `${aTime.slice(0,3)}00`,
                enTime: `${Number(aTime.slice(0,2))+1}:00`,
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

module.exports = routes;