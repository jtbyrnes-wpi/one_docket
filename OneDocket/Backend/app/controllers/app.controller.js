const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const AppointmentList = db.appointmentList;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.getAppointmentList = (req, res) => {

  AppointmentList.findOne({
    user: req.body.username
  })
    .exec((err, appointmentList) => {

      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!appointmentList) {
        return res.status(404).send({ message: "User Not found." });
      }

      var events = [];

      for (let i = 0; i < appointmentList.appointments.length; i++) {
             events.push(appointmentList.appointments[i]);
         };

      res.status(200).send({
        appointments: events
      });
    });


};


exports.addAppointment = (req, res) => {

  const appointment = {
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    details: req.body.details
  };

  const myquery = { user: req.body.username};
  const newvalues = {  $push: {
        appointments:
          appointment
    }
  };

  AppointmentList.updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("Appointment Added");
  });


};

exports.removeAppointment = (req, res) => {

  const myquery = { user: req.body.username};
  const newvalues = {  $pull: {
        appointments:
          { _id: req.body.id }
        }
      }

  AppointmentList.updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("Appointment Removed");
  });


};
