require("dotenv").config();
const express = require("express");
const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GithubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged Out");
});
app.get("/login", passport.authenticate("github"));
app.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
});

app.use("/", require("./routes"));
module.exports = app;