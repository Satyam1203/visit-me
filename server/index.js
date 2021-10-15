// Dependencies
const express = require("express"),
  app = express(),
  cors = require("cors"),
  cookieParser = require("cookie-parser");

const passport = require("./middlewares/passport");

// Import routes
let routes = require("./routes");

// Configure .env file
require("dotenv").config();

// Connecting to database
require("./models/connect")();

// Middleware function
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api", routes);

// Activate the server
app.listen(process.env.PORT, () => {
  console.log(`Listening at ${process.env.PORT}`);
});
