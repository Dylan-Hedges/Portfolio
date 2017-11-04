var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//ROOT ROUTE
router.get("/", function(req, res){
   res.render("landing"); 
});

//--------------------REGISTER----------------------------------------
//REGISTER ROUTE (form)
router.get("/register", function(req, res){
    res.render("register");
});

//REGISTER ROUTE (logic)
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/blogposts");
        });
    });
});

//--------------------LOGIN----------------------------------------
//LOGIN ROUTE (form)
router.get("/login", function(req, res){
   res.render("login"); 
});

//LOGIN ROUTE (form)
router.post("/login",  passport.authenticate("local", 
    {
        successRedirect: "/blogposts",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/blogposts");
});

//--------------------EXPORT----------------------------------------
module.exports = router;