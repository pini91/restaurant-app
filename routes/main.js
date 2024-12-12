const express = require("express");
const router = express.Router();
const mainController = require("../controllers/main");
const tableController = require("../controllers/table");
const editReservationController = require("../controllers/editReservation");
const admin = require("../controllers/admin");
const { ensureAuth  } = require('../middleware/auth')



//Main Routes 
router.get("/", mainController.getIndex);


router.get("/tables",ensureAuth, tableController.getTable); //, ensureAuth is gonna check for authentication, it checks to make sure that you are logged in 

router.get("/final",ensureAuth, tableController.getFinal)

router.get("/editReservation",ensureAuth, editReservationController.geteditReservationForm)

router.get("/tableToEdit", ensureAuth, editReservationController.getTableToEdit)

router.get("/finalEdit", ensureAuth, editReservationController.getFinalEdit)

router.get("/makeChanges", ensureAuth, editReservationController.getEditForm)

router.get("/reservationDeleted", editReservationController.getReservationDeleted)

router.get("/adminIndex",ensureAuth, admin.getAdminPage )

module.exports = router;

