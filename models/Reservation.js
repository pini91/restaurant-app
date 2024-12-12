const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  hour:{
    type: String,
    required: true,
  },
  partySize:{
    type:Number,
    required:true,
  },
  table:{
    type:String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userID:{
    type: String,
    required: true
  },
});


//MongoDB Collection named here. - will give lowercase plural of name
module.exports = mongoose.model('Reservation', ReservationSchema); // If you dont specify a collection name as the third argument, it will take your model name(Post) and make it plural