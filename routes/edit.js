const express = require("express");
const router = express.Router();
const editReservationController = require("../controllers/editReservation");
const { ensureAuth  } = require('../middleware/auth')


router.get("/", editReservationController.getEdit); //read the edit page

router.post("/editSession", editReservationController.editSession)//creating the new session

router.put("/editTable", editReservationController.editTable)

router.put("/editInfo", editReservationController.editInfo)

router.delete("/deleteReservation", editReservationController.deleteReservation)


module.exports = router;


