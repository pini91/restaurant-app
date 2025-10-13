const Reservations = require('../models/Reservation')
const User = require('../models/User')
// const nodemailer = require('nodemailer')

module.exports = {
  getEdit: (req, res) => {
    res.render('edit.ejs')
  },

  editSession: async (req, res, next) => {
    try {
      const reservationId = (req.body.id).trim()
      // retrieven the reservation id
      const currentReservation = await Reservations.find({ _id: reservationId })
      console.log(`FROM EDIT SESSION${currentReservation}`)

      // stablish a new session with the email using the id provided by the user
      const user = await User.create({
        email: currentReservation[0].email,
        password: currentReservation[0].email, // setting password to the currentReservationid to have
        reservationId: currentReservation[0].id
      })

      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
        console.log(`FROM EDIT SESSION REQ.USER${req.user}`)
        res.redirect('/editReservation')
      })
    } catch (err) {
      console.log(err)
    }
  },
  geteditReservationForm: (req, res) => {
    console.log(`THIS IS FROM GET EDIT RESERVATION FORM ${req.user}`)

    res.render('editReservation.ejs')
  },

  getTableToEdit: async (req, res) => {
    console.log(` THIS IS FROM GET TABLE TO EDIT${req.user}`)

    try {
      // Get the current user's reservation to get their selected date and time
      const userReservation = await Reservations.findOne({ userID: req.user.id })

      if (userReservation) {
        // Get all busy tables for the same date and time
        const busyReservations = await Reservations.find({
          date: userReservation.date,
          hour: userReservation.hour,
          table: { $ne: 'none' }, // exclude unassigned tables
          userID: { $ne: req.user.id } // exclude current user's reservation
        }).select('table')

        const busyTables = busyReservations.map(reservation => reservation.table)
        console.log(`Busy tables for ${userReservation.date} at ${userReservation.hour}:`, busyTables)

        res.render('tables.ejs', { busyTables })
      } else {
        // If no reservation found, render with empty busy tables
        res.render('tablesEdit.ejs', { busyTables: [] })
      }
      // res.render('tablesEdit.ejs')
    } catch (err) {
      console.log(err)
    }
  },

  editTable: async (req, res) => {
    console.log(` THIS IS FROM EDIT TABLE REQ.USER${req.user}`)

    try {
      // GET THE USER INFORMATION FROM CURRENT SESION TO GET THE LATEST ID RESERVATION.
      // let newReservation = await Reservations.find({session:session}).sort({ createdAt: -1}).limit(1)
      const reservationToEdit = await Reservations.findOne({ _id: req.user.reservationId })

      // console.log(`NEW FROM RESERVATION ${newReservation}`)

      console.log(`RESERVATION TO EDIT FROM EDIT TABLE ${reservationToEdit.id}`)

      // GET ALL THE RESERVATIONS EXCEPT THE NEW ONE FOR COMPARISON TO DETERMINE BUSY TABLES
      const all = await Reservations.find({ _id: { $nin: req.user.reservationId } })

      // console.log(`this is newReservation[0] ${newReservation[0]}`)
      if (all.length) {
        console.log(`FROM ALL IN EDIT TABLE ${all}`) // THIS WORKS WELL
      } else {
        console.log('all is empty')
      }

      // taking the tableNum from the client side js and asigning it to tableNum variable
      const tableNum = req.body.tableNumFromJSFile
      console.log(tableNum)

      // checking if the table is too small for the group
      let tableGroup = tableNum.split('')
      console.log(`Table split: ${tableGroup}`) // Debug: see the split result

      const tableCapacity = Number(tableGroup[1])
      const partySize = reservationToEdit.partySize
      const difference = Math.abs(tableCapacity - partySize)

      console.log(`Table capacity: ${tableCapacity}`)
      console.log(`Party size: ${partySize}`)
      console.log(`Difference: ${difference}`)

      tableGroup = difference > 1
      console.log(`FROM TABLEGROUP (is table too small/big?): ${tableGroup}`)

      if (tableGroup) {
        console.log('Table is too small or too big for party size')
        res.json('tooSmall')
      } else {
        // if there is reservations other than the current; see if that table and table is busy
        if (all.length) {
          // console.log(all)
          let result = false

          for (const doc in all) {
          //   console.log(`FROM ALL DOCS ${all[doc]}`)
            if (all[doc].date === reservationToEdit.date && all[doc].hour === reservationToEdit.hour && all[doc].table === tableNum) {
              // console.log(doc)
              result = true
            }
          }
          console.log(result)

          if (result) {
            console.log('failed, table is busy')
            res.json('failed')
          } else {
            console.log('Table is NOT busy')
            await Reservations.findOneAndUpdate({ _id: reservationToEdit.id }, {
              table: tableNum
            })
            res.json('success')
          }
        } else {
          console.log('This is the first reservation')
          await Reservations.findOneAndUpdate({ _id: reservationToEdit.id }, { // TAKE A LOOK AT THIS
            table: tableNum
          })
          res.json('success')
        }
      }
    } catch (err) {
      console.log(err)
    }
  },

  getFinalEdit: async (req, res) => {
    console.log(`THIS IS FROM GET FINAL EDIT${req.user}`)
    try {
      // GETTING THE LAST RESERVATION ID
      const response = await Reservations.find({ _id: req.user.reservationId })
      console.log(`FROM FINAL EDIT${response}`)

      // //RENDERING THE LAST PAGE
      //   res.render("final.ejs", {name: response[0].name[0].toUpperCase()+response[0].name.slice(1).toLocaleLowerCase(), id: response[0].id})

      // FUNCTION FOR THE EMAIL RESERVATION
      // async function main () {
      //   // create reusable transporter object using the default SMTP transport
      //   const transporter = nodemailer.createTransport({
      //     host: 'smtp-relay.brevo.com',
      //     secure: false, // true for 465, false for other ports
      //     auth: {
      //       user: process.env.EMAIL_USER, // generated brevo user
      //       pass: process.env.EMAIL_PASS // fixed environment variable name
      //     }
      //   })

      //   // send mail with defined transport object
      //   const info = await transporter.sendMail({
      //     from: 'testingmyaps@gmail.com', // sender address
      //     to: `${response[0].email}`, // receiver
      //     subject: 'RESTAURANT RESERVATION ✔', // Subject line
      //     text: `Hello ${response[0].name[0].toUpperCase() + response[0].name.slice(1).toLowerCase()} , You have changed your reservation. Your reservation number at Health and Taste for ${response[0].date} in table: ${response[0].table} at ${response[0].hour} is: ${response[0].id} to edit or delete your reservation go to: https://health-and-taste.up.railway.app/edit `
      //   })

      //   console.log('Message sent: %s', info.messageId)
      //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      //   // console.log(response[0].email)
      // }

      // main().catch(console.error)

      req.flash('info', 'An email has been sent with further instructions.')

      // DELETING THE USERID or removing the reservation from the admin
      if (req.user.isAdmin) {
        await User.findOneAndUpdate({ _id: req.user.id }, {
          reservationId: 'none'
        })
        console.log('reservation removed from the admin')
        res.redirect('/reservations')
      } else {
      // RENDERING THE LAST PAGE
        res.render('final.ejs', { name: response[0].name[0].toUpperCase() + response[0].name.slice(1).toLocaleLowerCase(), id: response[0].id })
        await User.findOneAndDelete({ email: response[0].email })
        console.log('Deleted User from Edit Final')
        // DESTROYING THE SESSION ID
        req.session.destroy((err) => {
          if (err) console.log('Error : Failed to destroy the session during logout.', err)
          req.user = null
        })
      }
    } catch (err) {
      console.log(err)
      req.flash('error', 'Error sending reset email. Please try again.')
    }
  },

  getEditForm: (req, res) => {
    console.log(`THIS IS FROM GET EDIT FORM ${req.user}`)

    const date = new Date()
    const curr = date.toJSON()
    const currMonth = curr.slice(0, 10)

    const dateToday = new Date()
    let month = dateToday.getMonth() + 3
    let day = dateToday.getDate()
    const year = dateToday.getFullYear()

    if (month < 10) { month = '0' + month.toString() }
    if (day < 10) { day = '0' + day.toString() }
    // day = day
    const time = new Date().getTime()
    const d = new Date()
    d.setHours(0, 0, 0, 0)

    let maxDate = year + '-' + month + '-' + day

    if (time >= 15 && time <= d) {
      day = day + 1
      maxDate = year + '-' + month + '-' + day
    }

    res.render('editForm.ejs', { currentDate: currMonth, maxDate })
  },

  editInfo: async (req, res) => {
    console.log(`THIS IS FROM EDIT INFO ${req.user}`)

    try {
      const reservation = await Reservations.find({ _id: req.user.reservationId })
      console.log(`FROM editInfo${reservation}`)

      console.log(req.body.date)

      await Reservations.findOneAndUpdate({ _id: reservation[0].id }, { // TAKE A LOOK AT THIS
        date: req.body.date,
        hour: req.body.hours,
        partySize: req.body.partySize
      })

      console.log('Reservation has been updated!')// QUITAR ESTE

      res.redirect('/tableToEdit')
    } catch (err) {
      console.log(err)
    }
  },

  deleteReservation: async (req, res) => {
    console.log(`THIS IS FROM DELETE RESERVATION${req.user}`)

    try {
      // Find post by id
      const reservation = await Reservations.findById({ _id: req.user.reservationId }) // We put this line here to make sure that post exist.
      console.log(reservation)
      // Delete post from db
      await Reservations.findOneAndDelete({ _id: req.user.reservationId })
      console.log('Reservation is deleted')

      // DELETING THE USERID
      await User.findOneAndDelete({ reservationId: req.user.reservationId })
      console.log('Deleted User from Edit Final')

      // DESTROYING THE SESSION ID
      req.session.destroy((err) => {
        if (err) console.log('Error : Failed to destroy the session during logout.', err)
        req.user = null
      })

      res.redirect('/reservationDeleted')
    } catch (err) {
      console.log(err)
    }
  },

  getReservationDeleted: (req, res) => {
    res.render('finalEdit.ejs')
  }

}
