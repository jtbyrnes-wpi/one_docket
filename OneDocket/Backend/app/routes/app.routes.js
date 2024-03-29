const { verifySignUp } = require("../middleware");
const controller = require("../controllers/app.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/app/getAppointmentList", controller.getAppointmentList);

  app.post("/api/app/addAppointment", controller.addAppointment);

  app.post("/api/app/removeAppointment", controller.removeAppointment);
};
