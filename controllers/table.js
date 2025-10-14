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
          from: 'Health and Taste <postmaster@brenda-app.dev>',
          to: `${response[0].email}`,
          subject: 'RESTAURANT RESERVATION ✔',
          text: `Hello ${response[0].name[0].toUpperCase() + response[0].name.slice(1).toLocaleLowerCase()}!, 
              Your reservation number at Health and Taste for ${response[0].date}, in table: ${response[0].table} at ${response[0].hour} is: ${response[0].id}.
              To edit or delete your reservation go to: 
              https://health-and-taste.up.railway.app/edit` // plain text body,
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
