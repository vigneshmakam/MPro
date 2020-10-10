const { response } = require("express");
const router = require("express").Router();

const fs = require('fs');

const authCheck = (req, res, next) => {
    if(!req.user){
        //if user is not logged In
        res.redirect("/auth/login");
    } else{
        next();
    }
}

router.get("/", authCheck, (req,res) => {
    console.log(req.user, req.newUser);
    res.send("In the profile route. Welcome -"  + req.user.profile.name + " Google---"+ req.user.displayname);
});

router.get("/mentorOnBoarding", (req, res) => {
    res.sendFile("/Users/vignesh/Documents/MPro/public/onboarding.html");
  }); 
  
router.post("/mentorOnBoarding", async (req, res) => {
    console.log(req.body);
    res.send("Thank You!");
});

module.exports = router;