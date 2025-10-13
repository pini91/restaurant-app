const FormData = require('form-data') // form-data v4.0.1
const Mailgun = require('mailgun.js') // mailgun.js v11.1.0

const Reservation = require('../models/Reservation')

const Users = require('../models/User')
// const { ObjectId } = require('mongodb');

// const nodemailer = require('nodemailer')
// require('dotenv').config({ path: "./config/.env" }); // If you're using environment variables

// RENDER THE TABLES
module.exports = {
  getTable: async (req, res) => {
    console.log(` THIS IS FROM GET TABLE${req.user}`)

    try {
      // Get the current user's reservation to get their selected date and time
      const userReservation = await Reservation.findOne({ userID: req.user.id })

      if (userReservation) {
        // Get all busy tables for the same date and time
        const busyReservations = await Reservation.find({
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
        res.render('tables.ejs', { busyTables: [] })
      }
    } catch (err) {
      console.log(err)
      res.render('tables.ejs', { busyTables: [] }) // fallback
    }
  },
  // RENDER THE LAST PAGE
  getFinal: async (req, res) => {
    // try {
    // GETTING THE LAST RESERVATION ID
    const response = await Reservation.find({ userID: req.user.id })
    console.log(`FROM RESPONSE IN FINAL${response}`)
    const response2 = await Reservation.findOne({ userID: req.user.id })
    console.log(response2)

    // FUNCTION FOR THE EMAIL RESERVATION
    // async function main () {
    // try {
    //   console.log('Starting email send...')
    //   console.log('Email recipient:', response[0].email)

    // FUNCTION FOR THE EMAIL RESERVATION
    async function sendSimpleMessage () {
      const mailgun = new Mailgun(FormData)
      const mg = mailgun.client({
        username: 'api',
        key: process.env.API_KEY || 'API_KEY'
        // When you have an EU-domain, you must specify the endpoint:
        // url: "https://api.eu.mailgun.net"
      })
      try {
        const data = await mg.messages.create('brenda-app.dev', {
          from: 'Mailgun Sandbox <postmaster@brenda-app.dev>',
          to: `${response[0].email}`,
          subject: 'RESTAURANT RESERVATION ✔',
          text: `Hello ${response[0].name[0].toUpperCase() + response[0].name.slice(1).toLocaleLowerCase()}!, 
              Your reservation number at Health and Taste for ${response[0].date}, in table: ${response[0].table} at ${response[0].hour} is: ${response[0].id}.
              To edit or delete your reservation go to<br>: https://health-and-taste.up.railway.app//edit` // plain text body,
        })

        console.log(data)
      } catch (error) {
        console.log(error) // logs any error
      }
    }

    sendSimpleMessage()

    // RENDERING THE LAST PAGE (after email is sent)
    res.render('final.ejs', { name: response[0].name[0].toUpperCase() + response[0].name.slice(1).toLowerCase(), id: response[0].id })

    // DELETING THE USERID
    if (!req.user.isAdmin) {
      await Users.findOneAndDelete({ _id: response[0].userID })
      console.log('Deleted User')
    }

    // DESTROYING THE SESSION ID
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
    })
  }
}

// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   secure: false, // true for 465, false for other ports
//   connectionTimeout: 10000, // 10 seconds timeout
//   greetingTimeout: 5000, // 5 seconds
//   socketTimeout: 10000, // 10 seconds
//   auth: {
//     user: process.env.EMAIL_USER, // generated brevo user
//     pass: process.env.EMAIL_PASS // generated brevo password
//   }
// })

// send mail with defined transport object
// const info = await transporter.sendMail({
//   from: 'testingmyaps@gmail.com',
//   to: response[0].email,
//   subject: 'RESTAURANT RESERVATION ✔',
//   text: `Hello ${response[0].name[0].toUpperCase() + response[0].name.slice(1).toLowerCase()}!\n\nYour reservation number at Health and Taste for ${response[0].date}, in table: ${response[0].table} at ${response[0].hour} is: ${response[0].id}.\n\nTo edit or delete your reservation click the link below:\n\nhttps://health-and-taste.up.railway.app/edit`
// })

// console.log('Message sent: %s', info.messageId)
// return info
//       } catch (emailError) {
//         console.error('Email sending failed:', emailError)
//         console.log('=== RESERVATION DETAILS FOR MANUAL EMAIL ===')
//         console.log('Customer:', response[0].name)
//         console.log('Email:', response[0].email)
//         console.log('Date:', response[0].date)
//         console.log('Time:', response[0].hour)
//         console.log('Table:', response[0].table)
//         console.log('Reservation ID:', response[0].id)
//         console.log('==========================================')
//         return null
//       }
//     }

//     // Add a timeout wrapper for the email function
//     // const emailWithTimeout = () => {
//     //   return Promise.race([
//     //     main(),
//     //     new Promise((resolve, reject) =>
//     //       setTimeout(() => reject(new Error('Email timeout after 15 seconds')), 15000)
//     //     )
//     //   ])
//     // } // Try to send email with timeout, but don't block the page
//     // try {
//     //   await emailWithTimeout()
//     // } catch (timeoutError) {
//     //   console.log('Email function timed out, continuing with page render')
//     //   console.log('=== RESERVATION DETAILS FOR MANUAL EMAIL ===')
//     //   console.log('Customer:', response[0].name)
//     //   console.log('Email:', response[0].email)
//     //   console.log('Date:', response[0].date)
//     //   console.log('Time:', response[0].hour)
//     //   console.log('Table:', response[0].table)
//     //   console.log('Reservation ID:', response[0].id)
//     //   console.log('==========================================')
//     // }

//     // RENDERING THE LAST PAGE (after email is sent)
//     res.render('final.ejs', { name: response[0].name[0].toUpperCase() + response[0].name.slice(1).toLowerCase(), id: response[0].id })

//     // DELETING THE USERID
//     if (!req.user.isAdmin) {
//       await Users.findOneAndDelete({ _id: response[0].userID })
//       console.log('Deleted User')
//     }

//     // DESTROYING THE SESSION ID
//     req.session.destroy((err) => {
//       if (err) console.log('Error : Failed to destroy the session during logout.', err)
//       req.user = null
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }

// }
