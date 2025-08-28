const express = require('express')
const router = express.Router()
const formController = require('../controllers/form')

router.get('/', formController.getForm)

router.post('/createReservation', formController.createReservation) // router to create the reservation as soon as the user is saved to get the req.user.id and save it.

router.put('/assignTable', formController.assignTable)

module.exports = router
