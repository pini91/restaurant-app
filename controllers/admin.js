const passport = require('passport')
const validator = require('validator')
//const Admin = require('../models/Reservation')
const User = require('../models/User')



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

  
    // const user = new User({ //new user is our user model and save it in a variable user
    //   email: req.body.email,
    //   password: req.body.password
    // })
  
    //const signUpUser = User.find({email: req.body.email})

  //   User.find({email: req.body.email}).then(function(data){
  //     if(!data){
  //       const savedUser = user.save()
  //       console.log(savedUser)
  //       res.redirect('/adminLogIn')
  //     }else{
  //       req.flash('errors', { msg: 'Account with that email address or username already exists.' })
  //       res.redirect('/admin')

  //     }
     
  //  })
   
    
    // if(!signUpUser){
    //   const savedUser = user.save()
    //   console.log(savedUser)
    //   res.redirect('/adminLogIn')
    // }else{
    //   req.flash('errors', { msg: 'Account with that email address or username already exists.' })
    //   res.redirect('/admin/signup')
    // }

    // (err, existingUser) => { //if theres an error throw that error
    //   if (err) { return next(err) }
    //   if (existingUser) { //if the user exist redirect to the signup
    //     req.flash('errors', { msg: 'Account with that email address or username already exists.' })
    //     return res.redirect('../signup')
    //   }
    //   user.save((err) => { //SAVING THE USER db
    //     if (err) { return next(err) }

    //     res.redirect('/adminLogIn')
    //   })
    // }
  
        
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

      getReservations: (req, res) => {
        console.log(req.user)
      
        res.render("adminReservations.ejs");
       
      },
  };

  
  