// Dependencies
let express = require("express"),
  app = express(),
  cors = require("cors");

// Import routes
let routes = require("./routes");

// Configure .env file
require("dotenv").config();

// Connecting to database
require("./models/connect")();

// Middleware function
app.use(express.json());
app.use(cors());

// Routes
app.use(routes);

// Activate the server
app.listen(process.env.PORT, () => {
  console.log(`Listening at ${process.env.PORT}`);
});
