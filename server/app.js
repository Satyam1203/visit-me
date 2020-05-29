// Dependencies
let express = require('express'),
    app = express(),
    cors = require('cors');

// Import routes
let indexRoutes = require('./routes/indexRoutes');

// Configure .env file
require('dotenv').config();

// Connecting to database
require('./db_model/connect')();

// Middleware function
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req,res)=>{res.send("helllo")})
app.post("/add-appt", indexRoutes);
app.post("/schedule", indexRoutes);

// For non-existing routes
app.use((req,res)=>res.status(404).send("Not found"));

// Activate the server
app.listen(process.env.PORT,()=>{
    console.log(`Listening at ${process.env.PORT}`);
});