// Yoonkyung Kim (121389191)
// ykim268@myseneca.ca

// I should make the repository private
// .gitignore 에 nodemodule , ... 넣기
///if the user enters blank spaces, we can clear that using trim()

const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const ds = require("./data");
const path = require("path");

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

app.get("/", (req, res) => {
    ds.getData().then((inData)=>{
        res.render("index", { data: inData, topMealSection: true });
    })
});

app.get("/home", (req, res) => {
    ds.getData().then((inData)=>{
        res.render("index", { data: inData, topMealSection: true });
    })
});

app.get("/meals-package", (req, res) => {
    ds.getData().then((inData)=>{
        res.render("mealsPackage", { data: inData });
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

// app.get("/dashboard", (req, res) => {
//     ds.getData().then((inData)=>{
//         res.render("dashboard", { data: inData });
//     })
// });

// var emailValidation = function(input){
//     return new Promise(function(resolve, reject){
//         if (input !== null && input !== undefined && input.length !== 0){
//             resolve(input);
//         } else {
//             reject("This field is required");
//         }
//     });       
// }

app.post("/login", (req, res) => {

    // to not clear the form if the data is invalid. Spaces must be erased
      var inputData = {
        email: req.body.email.trim(),
        password: req.body.password.trim()
    }

    // console.log(req.body);
    ds.getData().then((inData)=>{
        ds.validateLogin(req.body).then(() =>{
            res.redirect("/");
        }).catch(()=> {
            res.render("login", {
                data: inData,
                errorMessage: true,
                formData: inputData,
                page: "login"
            });
        })
    })
})

var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '6eeef2d984e75a',
        pass: '884696155e68cd'
        // user: 'lh849678@gmail.com',
        // pass: 'dkahsemvlzks11~'
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
        from: 'lh849678@gmail.com',
        to: inputData.email,
        subject: 'Welcome to Oneperfectmeal!',
        text: `Hey ${inputData.fName}, welcome to Oneperfectmeal. Enjoy a delicious and varied meal prepared for you!`
    };
        
    // console.log(inputData);
    ds.getData().then((inData)=>{
        ds.validateSignup(req.body).then(() =>{
            ds.storeUserInfo(req.body).then(() => {
                transporter.sendMail(mailOptions, (err, info)=> {
                    if (err){
                        console.log(err);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                })
                res.render("dashboard", { data: inData });
            }).catch(()=>{
                console.log("data fail to stored");
            })
        }).catch(()=> {
            res.render("registration", {
                errorMessage: true,
                data: inData,
                formData: inputData,
                page: "register"
            });
        })
    })
})

// app.post("/login", (req, res) => {
//     // emailValidation(req.body.email).then((input)=>{
//     //     console.log(`We received ${input}`);
//     // })
//     // .catch((reason) => {
//     //     console.log(reason);
//     // });

//     // should i do JSON.stringify()?
//     var inputData = {
//         email: JSON.stringify(req.body.email),
//         password: JSON.stringify(req.body.password)
//     }

//     if (inputData.email !== null && inputData.email.length !== 0){  
//         console.log(req.body.email);
//         ds.getData().then((inData)=>{
//             res.render("login", { data: inData });
//         })
//     } else {
//         ds.getData().then((inData)=>{
//             res.render("login", { 
//                 data: inData,
//                 formData: inputData,
//                 errors: "This field is required"
//             })
//         console.log("This field is required");
//         })
//     }
// });


// listen the port
app.listen(HTTP_PORT, onHttpStart);