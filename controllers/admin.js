const passport = require('passport')
const validator = require('validator')
//const Admin = require('../models/Reservation')
const User = require('../models/User')
const Reservations = require('../models/Reservation')



module.exports = {
    getAdminIndex: (req, res) => {
      
      res.render("adminSignUp.ejs");
     
    },

    getSignup: async (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/admin/adminSignup')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

    const user =await User.find({email: req.body.email})

    if(user.length){
      console.log(user)
      console.log("this email already exist")
      //req.flash('errors', { msg: 'Account with that email address or username already exists.' })
      res.redirect('/admin')
    }else{
      const savedUser = await User.create({ //new user is our user model and save it in a variable user
        email: req.body.email,
        password: req.body.password
      })
      console.log(savedUser)
      res.redirect('/adminLog')

    }

        
    },
    getAdminPage: (req, res) => {
      
      res.render("adminLogIn.ejs");
     
    },


    getAdminLogIn: (req, res, next) => {
      const validationErrors = []
      if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
      if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })
    
      if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('/adminLog')
      }
      req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
    
      passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err) }
        if (!user) {
          req.flash('errors', info)
          return res.redirect('/adminLog')
        }
        req.logIn(user, (err) => {
          if (err) { return next(err) }
          req.flash('success', { msg: 'Success! You are logged in.' })
          res.redirect(req.session.returnTo || '/reservations')
        })
      })(req, res, next)
      
      },

      getReservations: async (req, res) => {
        //console.loging the loged in admin
        console.log(req.user)

        //getting the calendar to see different reservations
        let date = new Date()
        let curr= date.toJSON()
        let currMonth= curr.slice(0,10)
  
  
        var dateToday = new Date();
        var month = dateToday.getMonth() + 3;
        var day = dateToday.getDate();
        var year = dateToday.getFullYear() ;
  
        if (month < 10)
          month = '0' + month.toString();
        if (day < 10)
          day = '0' + day.toString();
            day = day 
        var time = new Date().getTime();
        var d = new Date();
        d.setHours(0,0,0,0);
        if (time >= 15 && time <= d) {
        day = day+1;
        maxDate = year + '-' + month + '-' + day;
        } 
        var maxDate = year + '-' + month + '-' + day;


        //getting todays date
        let danas = new Date()
        danas = danas.toJSON()
        danas = danas.slice(0,10)

        try{
          const reservations = await Reservations.find({date: danas})
          res.render("adminReservations.ejs", {currentDate: currMonth, maxDate: maxDate, reservations: reservations, today:danas})
        }catch(err){
            console.log(err)
        }
       
      },

      logOut: (req, res) => {

        req.session.destroy((err) => {
          if (err) console.log('Error : Failed to destroy the session during logout.', err)
          req.user = null
          res.redirect("/adminLog")
        })
       
      },

      AdminDelete : async (req, res) => {
        try {
          await Reservations.findOneAndDelete({ _id: req.params.id });
          console.log("Reservation Deleted ");
          //res.redirect(req.get('referer'));
          res.redirect("/reservations");
        } catch (err) {
          console.log(err)
        }
      },

      //attaching the id to the admin
      adminReservations : async (req, res) => {
        console.log(`id from admin${req.params.id}`)
        try {
          await User.findOneAndUpdate({ _id: req.user.id },{
            reservationId: req.params.id
          });
          console.log("reservation added to admin user ");
          res.redirect("/makeChanges");
        } catch (err) {
          console.log(err)
        }
      },


        
  };

  
  