const mongoose = require("mongoose");

const connectDB = async () => {
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  return mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log(`connection to database established...`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
