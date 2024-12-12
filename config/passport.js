//const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
const passport = require('passport')
const bcrypt = require('bcrypt'); // Or another password hashing library

const customFields = {
  usernameField:'email',
  passwordField:'email'
}

const verifyCallback = (username, password, done)=>{

  User.findOne({username:username})
      .then((user)=>{
        if(!user){return done(null, false, { message: 'Incorrect username.' })}
        //DE AKI
        // if(user.isAdmin){
        //   bcrypt.compare(password, user.password, (err, isMatch) => {
        //     if (err) { return done(err); }
        //     if (isMatch) {
        //       return done(null, user);
        //     } else {
        //       return done(null, false, { message: 'Incorrect password.' });
        //     }
        //   })
          // user.comparePassword(password, (err, isMatch) => FROM LEON DE AQUI
          //   if (err) { return done(err) }
          //   if (isMatch) {
          //     return done(null, user)
          //   }
          //   return done(null, false, { msg: 'Invalid email or password.' })
          // }FROM LEON HASTAAQUI
  
        //};//AQUI

        // if(!user.isAdmin){//THIS TOO
        //   return done(null, user)
        // }
        const isValid= validPassword(password)

        // if(isValid){
        //   return done(null,user);
        // }else{
        //   return done(null, false);
        // }

        if(user){ return done(null, user)}
      })
      .catch((err)=>{
        done(err)
      })
}

const strategy = new LocalStrategy({
  passReqToCallback: true,
}, (customFields, verifyCallback ));

passport.use(strategy);

passport.serializeUser((user,done)=>{
  done(null,user.id); //here we are putting the user.id into the session
})

passport.deserializeUser((userId, done)=>{
  User.findById(userId) //when we want the user to come out of the session, we will grab that user id that was store there and find it in the database
    .then((user)=>{
      done(null,user);
    });
})

