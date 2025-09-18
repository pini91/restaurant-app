module.exports = {
  getIndex: (req, res) => {
    res.render('index.ejs')
  },
  // getReservationsRedirect: (req, res) => {
  //   res.render('redirectReservations')
  // },
  getMenu: (req, res) => {
    res.render('menu.ejs')
  },
  getBreakfast: (req, res) => {
    res.render('breakfast.ejs')
  },
  getLunch: (req, res) => {
    res.render('lunch.ejs')
  },
  getDinner: (req, res) => {
    res.render('dinner.ejs')
  },
  getGallery: (req, res) => {
    res.render('gallery.ejs')
  },
  getLocation: (req, res) => {
    res.render('location.ejs')
  }
}
