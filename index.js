// Dependencies
const express = require("express"),
  app = express(),
  cors = require("cors"),
  path = require("path"),
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

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(express.static("client/build"));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

// Activate the server
app.listen(process.env.PORT, () => {
  console.log(`Listening at ${process.env.PORT}`);
});
