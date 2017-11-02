//---------MIDDLEWARE----------
var Blogpost = require ("../models/blogpost");
var Comment = require ("../models/comment");
var middlewareObj ={};

//BLOGPOST OWNERSHIP
middlewareObj.checkBlogpostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Blogpost.findById(req.params.id, function(err, foundBlogpost){
           if(err || !foundBlogpost){
               req.flash("error", "Blogpost not found.");
               res.redirect("back");
           }else{
               if(foundBlogpost.author.id.equals(req.user._id)){
                    next();
               }else{
                   res.redirect("back");
               }
           } 
        });
    }else{
        res.redirect("back");
    }
}

//COMMENT OWNERSHIP
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }else{
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error", "You dont have permission to do that.");
                   res.redirect("back");
               }
           } 
        });
    }else{
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

//LOGIN CHECKER
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

//LOGIN CHECKER
middlewareObj.isLoggedInAdmin = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;