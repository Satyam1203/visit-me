let cron = require('node-cron');

//Import DB model
let Detail = require("../db_model/appt_detail");

// Update the arguments for scheduler
let task = cron.schedule('* 1 * * *', () => {
    // console.log('running a task every minute '+Date.now().toLocaleString());
    let date = `${(new Date()).getFullYear()}-${(new Date).getMonth()<9 ? `0${(new Date).getMonth()+1}`: `${(new Date).getMonth()+1}` }-${(new Date().getDate())}`;
    let time = (new Date()).getHours();
    // console.log(date, time)
    if(time === 8){
    Detail.find({
        aDate: date
    }, (err,dt)=>{
        if(err) res.status(404).json({err: "Error while sending remainder email"});
        else{
            try{

                let sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                dt.forEach(async d => {
                    try{
                        const msg = {
                            to: [d.email, 'thesarcastics123@gmail.com'],
                            from: 'admin@web-dist.com',
                            subject: 'Reminder- Shop visit',
                            text: `You can visit our store at  your preffered timing`,
                            html: `<h4>You had scheduled to visit our store at the mentioned time. Kindly be on time and follow social distancing norms directed by the government</h4>
                                    <p>Date: <strong>${d.aDate}</strong></p>
                                    <p>Time: <strong>${d.aTime} - ${d.aTime.slice(0,2)}:00</strong></p>
                                `,
                        };
                        await sgMail.send(msg);
                        console.log("Mail Sent to "+d.email);
                    }catch (r){
                        console.log("Cannot send"+r);
                    }
                })
            }catch (e){
                console.log("Exception : "+e);
            }
        }
    })

    }
});

module.exports = task;