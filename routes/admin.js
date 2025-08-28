const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
// const tableController = require("../controllers/table");
// const editReservationController = require("../controllers/editReservation");

router.get('/', adminController.getAdminIndex)

router.post('/adminSignup', adminController.getSignup)

router.post('/login', adminController.getAdminLogIn)

// new route
router.post('/date', adminController.getDate)

router.delete('/deleteReservation/:id', adminController.AdminDelete)

// to attach the reservationid to the admins
router.put('/editReservation/:id', adminController.adminReservations)

module.exports = router
