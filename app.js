//----------------REQUIRE PACKAGES--------------------
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Blogpost      = require("./models/blogpost"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
//----------------REQUIRE ROUTES--------------------
var commentRoutes       = require("./routes/comments"),
    blogpostRoutes    = require("./routes/blogposts"),
    indexRoutes         = require("./routes/index")

//----------------DATABASE CONNECTION--------------------
mongoose.connect("mongodb://localhost/portfolio", {useMongoClient: true});
// var url = process.env.DATABASEURL || "mongodb://localhost/portfolio";
// mongoose.connect(url);

//Production DB (mlab)
//mongoose.connect("enter Mlab URL HERE", {useMongoClient: true});

mongoose.Promise = global.Promise;

//----------------USE PACKAGES--------------------

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//----------------PASSPORT CONFIG--------------------
app.use(require("express-session")({
    secret: "THIS IS USED TO ENCODE",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//----------------USE ROUTES--------------------
app.use(indexRoutes);
app.use(blogpostRoutes);
app.use(commentRoutes);

//--------------------LISTENER--------------------
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has startd") 
});