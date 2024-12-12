const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
// const tableController = require("../controllers/table");
// const editReservationController = require("../controllers/editReservation");
const { ensureAuth  } = require('../middleware/auth')

router.get("/", adminController.getAdminIndex);

router.post("/login",adminController.getLogin)



module.exports = router;