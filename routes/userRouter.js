const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.js");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const { promisify } = require('util');
const crypto = require('crypto');
const randomBytesAsync = promisify(crypto.randomBytes);
const passport = require('passport');
const { Strategy: LinkedInStrategy } = require('passport-linkedin-oauth2');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const randomstring = require('randomstring');


router.get("/register", (req,res) => {
    //res.send("Hello, Its working!");
    res.sendFile('/Users/vignesh/Documents/MPro/public/register.html');
});

router.get("/login", (req,res) => {
    //res.send("Hello, Its working!");
    res.sendFile('/Users/vignesh/Documents/MPro/public/index.html');
});

router.post("/register", async (req,res) => {
    
    try{
    //const data = req.body;   
    console.log(req.body); 
    //let {displayname, email, password, passwordCheck} = data;
    //console.log(req.body.email, password, passwordCheck, displayname);
    const displayname = req.body.displayname;
    const email = req.body.email;
    const password = req.body.password;
    const passwordCheck = req.body.passwordCheck;
    const agreement = req.body.agree;
    const mentor = req.body.mentor;
    const mentee = req.body.mentee;

    console.log(displayname, email, password, passwordCheck);
    //validate

    if(!email || !password || !displayname)
        return res.status(400).json({msg: "Not all the fields have been entered!"});
    if(password.length < 5)
        return res.status(400).json({msg: "The password length has to be atleast 5 characters long."});
    if(password != passwordCheck)
         return res.status(400).json({msg: "The passwords have to be the same!"});
    
    const existinguser = await User.findOne({email: email});
    if (existinguser)
        return res.status(400).json({msg: "An account with this email id already exists!"});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const secretToken = randomstring.generate();
    //console.log(secretToken);
    const newUser = new User({
      email,
      password: passwordHash,
      displayname,
      agreement,
      emailVerificationToken: secretToken
    })
   
  const savedUser = await newUser.save();

  //verify email
  
  console.log(email, User._id);
  const mailOptions = {
    to: email,
    from: 'vigneshtest14@gmail.com',
    subject: 'Please verify your email address on MentorPRO',
    text: `Thank you for registering with MentorPRO.\n\n
      This verify your email address please click on the following link, or paste this into your browser:\n\n
      token: ${secretToken}
      \n\n
      Thank you!`
    };
    
  let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    
  transporter.sendMail(mailOptions);

  res.sendFile('/Users/vignesh/Documents/MPro/public/verify_email.html');
  }

  catch(err){
    res.status(500).json({error: err.message});
  }

});


router.post("/verify", async (req, res) => {
  try{
    const token = req.body.verifytoken;
    if(!token)
        return res.status(400).json({msg: "Not all the fields have been entered!"});
    const result = await User.findOne({emailVerificationToken: token});
    console.log(result);
    if(!result){
      res.send("Invalid token!")
    }
    this.emailVerified = true;
    res.sendFile('/Users/vignesh/Documents/MPro/public/onboarding.html');
  }
  catch(err){
    res.status(500).json({error: err.message});
  }

});  
router.post("/login", async (req, res) => {
    try{
        //const {email, password} = req.body;
        const email = req.body.email;
        const password = req.body.password;
        //const data = req.body;
        //const {email, password} = data;
        console.log(email, password);
        //validate email and password
        if(!email || !password)
            return res.status(400).json({msg: "Not all the fields have been entered!"});

        const user = await User.findOne({email: req.body.email});
        
        //console.log(user);
        if (!user)
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered." });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
              token,
              user: {
                id: user._id,
                displayName: user.displayName,
              },
        });

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
    
})

  /**
 * Sign in with Facebook.
 */
// route for facebook authentication and login
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/login' }), (req, res) => {
  
  res.redirect(req.session.returnTo || '/profile/');
});

router.get("/google", passport.authenticate('google',{
  scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email']
}));

router.get("/google/callback", passport.authenticate('google'), (req, res) => {
  res.redirect("/profile/");
});

router.post("/linkedIn", async(req, res) => {
    
});

router.delete("/delete", auth, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/tokenIsValid", async (req, res) => {
      try{
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
    
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
    
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
    
        return res.json(true);
      }
      catch(err){
        res.status(500).json({error: err.message});
    }
  });

router.get('/logout', (req, res) => {
  res.send("Logging Out");
});


module.exports = router;