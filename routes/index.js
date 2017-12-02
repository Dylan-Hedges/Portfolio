var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
//Contact form
var nodemailer = require("nodemailer");

//API key storage
var config = require("../config.js");
var clientID = config.clientID;
var clientSecret = config.clientID;
var user = config.user;
var refreshToken = config.refreshToken;
var accessToken = config.accessToken;


//".router" is used isntead of "app." as our routes are now in a seperate file that links back to the "app.js" file

//ROOT ROUTE
router.get("/", function(req, res){
   res.render("landing"); 
});

//ABOUT ROUTE
router.get("/about", function(req, res){
   res.render("about"); 
});

//PROJECTS ROUTE
router.get("/projects", function(req, res){
   res.render("projects"); 
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
            res.redirect("back");
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
        successFlash: "Welcome, you have successfully logged in",
        failureRedirect: "/login",
        failureFlash: "Invalid username or password."
    }), function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logout successful.");
   res.redirect("back");
});

//--------------------CONTACT PAGE----------------------------------------
//CONTACT ROUTE
router.get("/contact", function(req, res){
   res.render("contact"); 
});

//CONTACT FORM
router.post("/send", function(req, res){
    var contactname = req.body.contactname,
        email = req.body.email,
        company = req.body.company,
        title = req.body.title,
        message = req.body.message;
    //Content that is delivered to my email
    var output = `    
        <p>${message}</p>
        <h4><u>Contact Details</u></h4>
        <p><b>Name:</b> ${contactname}<br>
        <b>Company:</b> ${company}<br>
        <b>Email:</b> ${email}
        </p>
    `;

    //Account connection and authorization
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: user,
            clientID: clientID,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: accessToken
        }
    });
    
    //Listens for new access tokens, if an access token expires it uses refreshToken to generate a new access token
   transporter.on('token', token => {
        console.log('A new access token was generated');
        console.log('User: %s', token.user);
        console.log('Access Token: %s', token.accessToken);
        console.log('Expires: %s', new Date(token.expires));
    });
    
    //Sending information
    let mailOptions = {
        from: `${contactname} <${user}>`, // sender address
        to: user, // list of receivers
        subject: `Nodemailer: ${title}`, // Subject line
        text: 'No message entered.', // text if nothing is filled out
        html: output // html body
        // auth: {
        //     user: user,
        //     refreshToken: refreshToken,
        //     accessToken: accessToken
        // }
    };
    //Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            req.flash("error", "Message failed to send.");
            res.redirect("contact");    
        }else{
            // console.log('Message sent: %s', info.messageId);
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            
            req.flash("success", "Message successfully sent, i will be in touch soon!");
            res.redirect("contact");            
        }
    });
    
});


//--------------------EXPORT----------------------------------------
module.exports = router;