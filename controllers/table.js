// const express = require('express')

const Reservation = require('../models/Reservation')

const Users = require('../models/User')
// const { ObjectId } = require('mongodb');

const nodemailer = require('nodemailer')
// require('dotenv').config({ path: "./config/.env" }); // If you're using environment variables

// RENDER THE TABLES
module.exports = {
  getTable: async (req, res) => {
    console.log(` THIS IS FROM GET TABLE${req.user}`)

    try {
      res.render('tables.ejs')
    } catch (err) {
      console.log(err)
    }
  },
  // RENDER THE LAST PAGE
  getFinal: async (req, res) => {
    try {
      // GETTING THE LAST RESERVATION ID
      const response = await Reservation.find({ userID: req.user.id })
      console.log(`FROM RESPONSE IN FINAL${response}`)

      // RENDERING THE LAST PAGE
      res.render('final.ejs', { name: response[0].name[0].toUpperCase() + response[0].name.slice(1).toLowerCase(), id: response[0].id })

      // FUNCTION FOR THE EMAIL RESERVATION
      async function main () {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          host: 'smtp-relay.brevo.com',
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER, // generated brevo user
            pass: process.env.EMAIL_PASS // generated brevo password
          }
        })

        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'testingmyaps@gmail.com', // sender address
          to: `${response[0].email}`, // receiver
          subject: 'RESTAURANT RESERVATION ✔', // Subject line
          text: `Hello <b>${response[0].name[0].toUpperCase() + response[0].name.slice(1).toLocaleLowerCase()}!</b> ,
           Your reservation number at Health and Taste for <b>${response[0].date}</b>, in table: <b>${response[0].table}</b> at <b>${response[0].hour}</b> is: <b>${response[0].id}</b>.
           To edit or delete your reservation go to: http://pet-social-app.up.railway.app/edit`// plain text body
        })

        console.log('Message sent: %s', info.messageId)
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // console.log(response[0].email)
      }

      main().catch(console.error)

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
    } catch (err) {
      console.log(err)
    }
  }

}
