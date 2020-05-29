let express = require('express'),
    app = express(),
    cors = require('cors'),
    mongoose = require('mongoose');

// Configure .env file
require('dotenv').config();

// Connecting to database
require('./db_model/connect')();

// Middleware function
app.use(express.json());
app.use(cors());

app.get("/", (req,res)=>{res.send("helllo")})

app.use((req,res)=>res.status(404).send("Not found"));

// Listen to port
app.listen(process.env.PORT,()=>{
    console.log(`Listening at ${process.env.PORT}`);
});