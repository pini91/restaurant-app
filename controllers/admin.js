const passport = require('passport')
const validator = require('validator')
//const Admin = require('../models/Reservation')



module.exports = {
    getAdminIndex: (req, res) => {
      
      res.render("adminIndex.ejs");
     
    },

    getLogin: async (req, res) => {

      try{
        const user= await User.find({email:req.body.email},{password:req.body.password}) 

        
        // req.logIn(user, (err) => {
        //   if (err) {
        //     return next(err)
        //   }
        //   console.log(req.user)
        //   res.redirect('/tables')
        // })
   
        }catch(err){
            console.log(err)
        }
    // req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    // passport.authenticate('local', (err, user, info) => {
    //   if (err) { return next(err) }
    //   if (!user) {
    //     req.flash('errors', info)
    //     return res.redirect('/admin/login')
    //   }
    //   req.logIn(user, (err) => {
    //     if (err) { return next(err) }
    //     req.flash('success', { msg: 'Success! You are logged in.' })
    //     res.redirect(req.session.returnTo || '/adminIndex')
    //     })
    //   })(req, res, next)

      
    },

    getAdminPage: (req, res) => {
      console.log(`THIS IS FROM GET ADMIN PAGE${req.user}`)
      
      res.render("adminReservations.ejs");
     
    },
  };

  
  