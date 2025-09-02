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

      // FUNCTION FOR THE EMAIL RESERVATION
      async function main () {
        try {
          console.log('Starting email send...')
          console.log('Email recipient:', response[0].email)

          // Try alternative SMTP settings for Brevo
          const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            // port: 465, // Trying SSL port instead
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 60000, // 60 seconds
            greetingTimeout: 30000, // 30 seconds
            socketTimeout: 60000 // 60 seconds
          })

          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: 'testingmyaps@gmail.com',
            to: response[0].email,
            subject: 'RESTAURANT RESERVATION ✔',
            text: `Hello ${response[0].name[0].toUpperCase() + response[0].name.slice(1).toLowerCase()}!\n\nYour reservation number at Health and Taste for ${response[0].date}, in table: ${response[0].table} at ${response[0].hour} is: ${response[0].id}.\n\nTo edit or delete your reservation click the link below:\n\nhttp://health-and-taste.up.railway.app/edit`
          })

          console.log('Message sent: %s', info.messageId)
          return info
        } catch (emailError) {
          console.error('Email sending failed:', emailError)
        }
      }
      main().catch(console.error)

      // RENDERING THE LAST PAGE
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
    } catch (err) {
      console.log(err)
    }
  }

}
