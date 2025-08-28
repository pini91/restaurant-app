// this middleware is gonna help us make sure we are actually logged in or if we have authorization

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      console.log('couldnt find your authentication babe!')// BORRAR LUEGO, you wont be allowed in the tables route if you are not logged in
      res.redirect('/adminLog')
    }
  },

  isAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next()
    } else {
      console.log('couldnt find your authentication or you are not an admin')// BORRAR LUEGO, you wont be allowed in the tables route if you are not logged in
      res.redirect('/adminLogIn')
    }
  }
}

// req.isAuthenticated() method checks if the user is already authenticated by the authentication
// function or not, for example, if you have an admin dashboard page and you want to ensure that
// only authenticated users can access this page, therefore you use req.isAuthenticated() method to
// ensure that the user who sends the request is already authenticated by the authentication function.
