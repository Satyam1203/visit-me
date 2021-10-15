let mongoose = require("mongoose");

const connect_db = () => {
  mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    (err) => {
      if (err) console.log("Error : " + err);
      else console.log("Database connection established");
    }
  );
};
module.exports = connect_db;
