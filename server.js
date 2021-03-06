const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb+srv://Batch_Mates:GB6PBk0LQXMIaz25@cluster0.h5bv1.mongodb.net/Branch-data?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    info: String
});

var noticeHeading = ["Reopen the College", "Mask Bunk Tommorow", "Event on 21st"];
var noticeBody = [
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat',
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat",
];

const User = mongoose.model("User", userSchema);

const key = "CE-Family";

var _username = "";

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/home.html");
});

app.get("/login", function(req, res) {
    if (req.cookies["Login Key"] === key) {
        res.redirect("/home");
    } else {
        res.render("login", { typ: "username" });
    }
});

app.post("/login", function(req, res) {
    if (req.body.button === "username") {
        _username = req.body.username;
        if (_username.substr(0, 5) === "b5200") {
            res.render("login", { typ: "password" });
        } else {
            console.log("Traitor Spotted");
            res.sendFile(__dirname + "/error.html");
        }
    } else if (req.body.button === "password") {

        User.findOne({ username: _username }, function(err, uid) {
            if (err) {
                console.log(err);
            } else {
                res.cookie("uid", uid);
                if (req.body.password === psd.password) {
                    console.log(uid);
                    res.cookie("Login Key", "CE-Family");
                    username = "";
                    res.redirect("/home");
                } else {
                    console.log("Traitor Spotted")
                    res.sendFile(__dirname + "/error.html");
                }
            }
        })
    } else {
        console.log("Traitor Spotted")
        res.sendFile(__dirname + "/error.html");
    }
});

app.get("/register", function(req, res) {
    if (req.cookies["Login Key"] === key) {
        res.redirect("/home");
    } else {
        res.render("register");
    }
});

app.post("/register", function(req, res) {
    _username = req.body.username;
    if (_username.substr(0, 5) === "b5200") {
        if (req.body.password === req.body.pwd) {
            var user = new User({
                name: req.body.name,
                username: _username,
                email: req.body.email,
                password: req.body.password
            })
            user.save();
            _username = "";
            res.cookie("Login Key", "CE-Family");
            res.cookie("uid", user);
            res.redirect("/home");
        } else {
            console.log("password not same");
            res.redirect("/register");
        }
    } else {
        console.log("Traitor Spotted")
        res.sendFile(__dirname + "/error.html")
    }
});

app.get("/home", function(req, res) {
    if (req.cookies["Login Key"] === key) {
        res.render("home");
    } else {
        console.log("Login to See details");
        res.redirect("/login");
    }
});

app.get("/time-table", function(req, res) {
    if (req.cookies["Login Key"] === key) {
        res.render("time");
    } else {
        console.log("Login to See details");
        res.redirect("/login");
    }
});

app.get("/notice", function(req, res) {
    if (req.cookies["Login Key"] === key) {
        res.render("notice", { hd: noticeHeading, bd: noticeBody });
    } else {
        console.log("Login to See details");
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res) {
    res.clearCookie("Login Key");
    res.render("logout");
});

app.get("/friends", function(req, res) {
    res.sendFile(__dirname + "/loading.html");
});

app.get("/css", function(req, res) {
    res.sendFile(__dirname + "/Files/style.css");
});

var port = process.env.PORT || 2202;
app.listen(port, function() {
    console.log("Listening to the port " + port);
});