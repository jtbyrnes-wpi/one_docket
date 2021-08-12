const db = require("../models");
const AppointmentList = db.appointmentList;

checkDuplicateStartOrEndTime = (req, res, next) => {
  // Start
  AppointmentList.findOne({
    start: req.body.start
  }).exec((err, start) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (start) {
      res.status(400).send({ message: "Failed! Conflicting appointment times!" });
      return;
    }

    // End
    AppointmentList.findOne({
      end: req.body.end
    }).exec((err, end) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (end) {
        res.status(400).send({ message: "Failed! Conflicting appointment times!" });
        return;
      }

      next();
    });
  });
};


const verifyAppointment = {
  checkDuplicateStartOrEndTime
};

module.exports = verifyAppointment;
