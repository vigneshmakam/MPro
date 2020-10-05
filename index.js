const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const passport = require('passport');
const passportSetup = require('./config/passport');
const cookieSession = require('cookie-session');
//setup for express

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Initializing the port to connect to
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The port has started ${PORT}`));

//Using cookies
app.use(cookieSession({
    maxAge: 2592000,
    keys: [process.env.JWT_SECRET]

}));
//app.use(session({ secret: 'anything' }));
//Inititalize passport here
app.use(passport.initialize());
app.use(passport.session());

//Set up Mongoose
//adminprO

mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING, 
    {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
});
mongoose.connection.once('open', function(){
    console.log('Conection has been made!');
  }).on('error', function(error){
      console.log('Error is: ', error);
  });


//Set up Routes
app.use("/home", require("./routes/homeRouter"));
app.use("/auth", require("./routes/userRouter"));
app.use("/profile", require("./routes/profileRouter"));