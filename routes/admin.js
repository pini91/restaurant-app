const express = require("express");
const router = express.Router();
const passport = require('passport')
const adminController = require("../controllers/admin");
// const tableController = require("../controllers/table");
// const editReservationController = require("../controllers/editReservation");
const { ensureAuth  } = require('../middleware/auth')

router.get("/", adminController.getAdminIndex);

router.post("/adminSignup", adminController.getSignup);

router.post("/login", adminController.getAdminLogIn);

router.delete("/deleteReservation/:id", adminController.AdminDelete);

//to attach the reservationid to the admins
router.put("/editReservation/:id", adminController.adminReservations )





module.exports = router;