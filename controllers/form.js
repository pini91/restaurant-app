
const passport = require('passport')
const validator = require('validator')
const Reservations = require('../models/Reservation')
const User = require('../models/User');
// const table = require('./table');


//app.set('trust proxy', 1)

module.exports = {

    getForm: (req, res) => {
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
      res.render("form.ejs" , { currentDate: currMonth, maxDate: maxDate} );

    
    },

    createReservation: async (req, res, next) =>{
      const validationErrors = []
      if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
      // if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
      // if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
    
      if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('../bookForm')
      }
      req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

    
      try{
        const user= await User.create({ 
          email: req.body.email,
          password: req.body.email
        })
          console.log(`FROM USER CREATE${user}`)

        await Reservations.create({
          name: req.body.name, 
          phoneNumber: req.body.phoneNumber, 
          email: req.body.email,
          date: req.body.date, 
          hour: req.body.hours, 
          partySize: req.body.partySize,
          table:'none',
          userID: user.id

        }) // when putting a new item i decide the userID: name the require the req.user.id

        console.log('Reservation has been added!')//QUITAR ESTE 

        // User.findOne({$or: [ //checking if this user is already registrated
        //   {email: req.body.email},
        //   {password: req.body.email}
        // ]}, (err, existingUser) => { //if theres an error throw that error
        //   if (err) { return next(err) }
        //   if (existingUser) { //if the user exist redirect to the signup
        //     // req.flash('errors', { msg: 'Account with that email address or username already exists.' })
        //     // return res.redirect('../signup')
        //   }
        //   user.save((err) => { //SAVING THE USER db
        //     if (err) { return next(err) }
        //     req.logIn(user, (err) => {
        //       if (err) {
        //         return next(err)
        //       }
        //       res.redirect('/todos')
        //     })
        //   })
        // })
        req.logIn(user, (err) => {
          if (err) {
            return next(err)
          }
          console.log(req.user)
          res.redirect('/tables')
        })
   
        }catch(err){
            console.log(err)
        }

      },

    assignTable: async (req, res) =>{
      console.log(` THIS IS FROM ASSIGN TABLE${req.user}`)
      // let galleta = req.cookies
      // galleta = galleta['connect.sid']
     
      //console.log(`FROM ASSIGNTABLE${req.user}`)

      try{
        //GET THE USER INFORMATION FROM CURRENT SESION TO GET THE LATEST ID RESERVATION. 
        //let newReservation = await Reservations.find({session:session}).sort({ createdAt: -1}).limit(1)
        let newReservation = await Reservations.find({userID:req.user.id})
        
          //console.log(`NEW FROM RESERVATION ${newReservation}`)

        
        console.log(`NEW ${newReservation[0].id}`)

        //GET ALL THE RESERVATIONS EXCEPT THE NEW ONE FOR COMPARISON TO DETERMINE BUSY TABLES
        const all= await Reservations.find({userID: { $nin: req.user.id}})
       
       
        //console.log(`this is newReservation[0] ${newReservation[0]}`)
        if(all.length){
          console.log(`FROM ALL ${all}`) //THIS WORKS WELL
        }else{
          console.log("all is empty")
        }
        

        //taking the tableNum from the client side js and asigning it to tableNum variable
        const tableNum= req.body.tableNumFromJSFile
        console.log(tableNum)

        //if there is reservations other than the current; see if that table and table is busy
        if(all.length){
          console.log(all)
          let result= false

          for(const doc in all){
          //   console.log(`FROM ALL DOCS ${all[doc]}`)
            if(all[doc].date === newReservation[0].date && all[doc].hour === newReservation[0].hour && all[doc].table===tableNum ){
              // console.log(doc)
              result= true
            }
          }
          console.log(result)
          
          if(result){
            console.log('failed, table is busy')
            res.json('failed')
          }else{
            console.log("Table is NOT busy")
            await Reservations.findOneAndUpdate({_id:newReservation[0].id},{ //TAKE A LOOK AT THIS
              table: tableNum
              })
            res.json('success')
          }
        }else{
          console.log("This is the first reservation")
          await Reservations.findOneAndUpdate({_id:newReservation[0].id},{ //TAKE A LOOK AT THIS
            table: tableNum
            })
          res.json('success')
        }
     
      }catch(err){
          console.log(err)
        }

    
    }

  };

  
  