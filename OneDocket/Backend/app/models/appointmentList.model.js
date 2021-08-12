const mongoose = require("mongoose");

const AppointmentList = mongoose.model(
  "AppointmentList",
  new mongoose.Schema({
    user: String,
    appointments: [{
      title: String,
      start: String,
      end: String,
      email: String,
      phoneNumber: String,
      details: String
    }]
  })
);

module.exports = AppointmentList;
