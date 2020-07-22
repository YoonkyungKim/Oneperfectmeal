// Yoonkyung Kim (121389191)
// ykim268@myseneca.ca
// Heroku link: https://sheltered-beyond-52937.herokuapp.com/
// Github link: https://github.com/YoonkyungKim/WEB322-Oneperfectmeal


const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const ds = require("./data");
const db = require("./db");
const path = require("path");

const clientSessions = require("client-sessions");
// require('dotenv').config()

// Handlebars setup
// register handlebars as the rendering engine for views
app.set("views", "./views");  // indicates handlebars files' location

// Setting up rendering engine
// It tells that we uses .hbs files, and we can just call the filename without the extension when rendering files
app.engine(".hbs", exphbs({ extname: ".hbs",
    defaultLayout: 'main',
    helpers: {
        // custom helper that compares two parameter and return the value based on the result of the comparison
        ifSame: function(a, b, options) {
            if (a == b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    } 
})
);

// Setup view engine
app.set("view engine", ".hbs"); 

// Setup the static folder
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

// Set the middleware for urlencoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set the port
const HTTP_PORT = process.env.PORT || 3000;

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);   
}

// setup client-sessions
app.use(clientSessions({
    cookieName: "session",
    secret: "funnyandexcitingoneperfectmeal", // long un-guessable string
    duration: 10 * 60 * 1000,  // duration of the session in milliseconds (10 min)
    activeDuration: 1000 * 60  // the session will be extended by this many ms each req (1 min)
}));

app.get("/", (req, res) => {
    ds.getData().then((inData)=>{
        if (req.session.user){
            res.render("index", { 
                data: inData, 
                topMealSection: true,
                loggedIn: true
            });
        } else {
            res.render("index", { 
                data: inData, 
                topMealSection: true
            });
        }
    })
});

app.get("/meals-package", (req, res) => {
    ds.getData().then((inData)=>{
        if (req.session.user){
            res.render("mealsPackage", { 
                data: inData,
                loggedIn: true
            });
        } else {
            res.render("mealsPackage", { 
                data: inData
            });
        }
    })
});

app.get("/register", (req, res) => {
    ds.getData().then((inData)=>{
        res.render("registration", { 
            data: inData, 
            page: "register" 
        });
    })
});

app.get("/login", (req, res) => {
    ds.getData().then((inData)=>{
        res.render("login", { 
            data: inData,
            page: "login"
         });
    })
});


// dashboard: private route
app.get("/dashboard", (req, res) => {
    ds.getData().then((inData)=>{
        if (req.session.user){
            if (req.session.user.admin){
                res.render("clerk_dashboard", {
                    data: inData, 
                    user: req.session.user,
                    loggedIn: true
                });
            } else {
                res.render("dashboard", {
                    data: inData, 
                    user: req.session.user,
                    loggedIn: true
                });
            }
        } else {
            res.redirect("/login");
        }
    })
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/login");
});

app.post("/login", (req, res) => {
    // to not clear the form if the data is invalid. Spaces must be erased
      var inputData = {
        email: req.body.email.trim(),
        password: req.body.password.trim()
    }

    ds.getData().then((inData)=>{
        db.validateLogin(req.body).then(() =>{
            db.validateUser(req.body)
            .then((userData)=>{
                req.session.user = userData; // add it to a session. (log it in as a user)

                console.log(req.session.user);

                if (req.session.user.admin){
                    res.render("clerk_dashboard", {
                        data: inData, 
                        user: req.session.user, 
                        loggedIn: true
                    });
                } else {
                    res.render("dashboard", {
                        data: inData, 
                        user: req.session.user,
                        loggedIn: true
                    });
                }
            })
            .catch((message) => {
                console.log(message);
                res.render("login", {
                    data: inData,
                    formData: inputData,
                    error: true,
                    page: "login",
                    invalidUser: true
                });
            })
        }).catch(()=> {
            db.getErrData().then((errorData)=>{
                res.render("login", {
                    data: inData,
                    error: true,
                    errData: errorData,
                    formData: inputData,
                    page: "login",
                });
            })
        })
    })
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PW
    }
});

app.post("/register", (req, res) => {

    // to not clear the form if the data is invalid. Spaces must be erased
    var inputData = {
        fName: req.body.fName.trim(),
        lName: req.body.lName.trim(),
        email: req.body.email.trim(),
        password: req.body.password.trim()
    }

    // mail options
    var mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: inputData.email,
        subject: 'Welcome to Oneperfectmeal!',
        text: `Hey ${inputData.fName}, welcome to Oneperfectmeal. Enjoy a delicious and varied meal prepared for you!`
    };
        
    ds.getData().then((inData)=>{
        db.validateSignup(req.body)
        .then(() =>{
            db.addUser(req.body)
            .then(() => {
                transporter.sendMail(mailOptions, (err, info)=> {
                    if (err){
                        console.log(err);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                })
                // if the user is successfully added, render login page
                res.render("login", { 
                    data: inData,
                    page: "login",
                    afterRegister: true
                });
            }).catch((msg)=>{
                console.log("data fail to stored");
                res.render("registration", {
                    error: true,
                    data: inData,
                    formData: inputData,
                    page: "register",
                    errormsg: msg
                });
            })
        }).catch(()=> {
            db.getErrData().then((errorData)=>{
                res.render("registration", {
                    data: inData,
                    error: true,
                    errData: errorData,
                    formData: inputData,
                    page: "register"
                });
            })
        })
    })
});

// if db connection is successful, listen the port
db.initialize().then(()=>{
    console.log("Data read successfully");
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((data)=>{
    console.log(data);
})