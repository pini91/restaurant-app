const passport = require('passport')
//const validator = require('validator')
const Admin = require('../models/Admin')



//this middleware is gonna help us make sure we are actually logged in or if we have authorization

module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      } else {
        console.log("couldnt find your authentication babe!")//BORRAR LUEGO, you wont be allowed in the tables route if you are not logged in
        res.redirect('/bookForm')
      }
    },

    // auth: function async (req, res, next) {
    //   //req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

    //   try{
    //       const admin = Admin.find(
    //         {email: req.body.email},
    //         {password: req.body.password}
    //       )

    //       console.log(admin)

    //       if(admin){
    //         next()

    //       }else{
    //         req.flash('errors', { msg: 'Account with that email address or username doesnt exists.' })
    //         res.redirect("/admin")
    //       }

    //     }catch(err){
    //         console.log(err)
    //       }
    // },
  }


  //req.isAuthenticated() method checks if the user is already authenticated by the authentication 
  //function or not, for example, if you have an admin dashboard page and you want to ensure that 
  //only authenticated users can access this page, therefore you use req.isAuthenticated() method to 
  //ensure that the user who sends the request is already authenticated by the authentication function.
  