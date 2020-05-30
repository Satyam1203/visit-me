let routes = require('express').Router(),
    mongoose = require('mongoose');

// Database models
let Detail = require('../db_model/appt_detail');
let Schedule = require('../db_model/appt_schedule');

// Shop closing and opening times
let OPEN_TIME_HR = 9,
    CLOSE_TIME_HR = 18,
    MAX_ALLOWED = 5;

routes.post("/add-appt", (req,res)=>{
    name=req.body.name;
    purpose=req.body.purpose;
    aDate=req.body.date;
    aTime=req.body.time;
    phone=req.body.phone;
    email=req.body.email;
    // console.log(name, aDate, aTime, email);
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
            if(schedule.count >= MAX_ALLOWED){
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

routes.post("/show-appt", (req,res)=>{
    email = req.body.email;
    Detail.find({
        email
    }, (err, detail)=>{
        if(err) res.status(404).json({err: "Error while displaying your appointments"})
        else if(detail.length===0) res.json({err: "No appointments exist for this email id"})
        else {
            res.json({detail});
        }
    })
})

routes.post("/remove-appt/:id", (req,res)=>{
    id = mongoose.Types.ObjectId(`${req.params.id}`);
    // email = req.body.email;
    // console.log(id);
    // Schedule.findOneAndUpdate({
    //     _id:id
    // }, {
    //     $dec: {count:1}
    // }
    // ,(err, schedule)=>{
    //     if(err) res.status(404).json({err:"Error while count-=1"});
    //     else {
    //         // console.log(schedule)
    //         if(schedule.count === 0){
    //             Schedule.deleteOne({_id: schedule._id});
    //         }
    //         Detail.deleteOne({
    //             email, aTime: schedule.stTime
    //         }, (err, dt)=>{
    //             if(err) res.status(404).json({err: "Error while adding detail"});
    //             else res.json({err: "Appointment cancelled successfully"});
    //         })
    //     }
    // })
    Detail.findOneAndDelete({
        _id:id
    }, (err, dt)=>{
        if(err) res.status(404).json({err: "Error while removing detail"});
        else {
            time=`${dt.aTime.slice(0,2)}:00`;
            Schedule.findOneAndUpdate({
                stTime: time, Date: dt.aDate
            }, {
                $inc: {count:-1}
            }
            ,(err, schedule)=>{
                if(schedule.count === 1) {
                    console.log(schedule._id);
                    Schedule.deleteOne({_id: mongoose.Types.ObjectId(`${schedule._id}`)}, (err,dt)=>{
                        if(err) res.status(404).json({err: "Failed deleting schedule"});
                    })
                }
                if(err) res.status(404).json({err:"Error while count-=1"});
                else if(!schedule) res.json({err: "Could not remove appointment now"});
                else {
                    res.json({err: "Appointment cancelled successfully"});
                }
            })
        }
    })
})

routes.post("/schedule", (req,res)=>{
    date=req.body.date;
    availableTimings=[];
    Schedule.findOne({
        Date: date
    }, (err,schedule)=>{
        console.log(schedule);
        if(err) res.status(404).json({err: "Error occured"});
        else if(!schedule){
            for (let i = OPEN_TIME_HR; i < CLOSE_TIME_HR; i++) {
                availableTimings = [...availableTimings, [`${i}:00`, `${i+1}:00`]];
            }
            res.json({"timings":availableTimings});
        }else{
            for (let i = OPEN_TIME_HR; i < CLOSE_TIME_HR; i++) {
                if(Number(schedule.stTime.slice(0,2))===i){
                    if(schedule.count < MAX_ALLOWED) availableTimings = [...availableTimings, [`${i}:00`, `${i+1}:00`]];
                } else
                    availableTimings = [...availableTimings, [`${i}:00`, `${i+1}:00`]];
            }
            res.json({"timings":availableTimings});
        }
    })
})

module.exports = routes;