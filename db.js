const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { resolve } = require("path");

require('dotenv').config()

let Schema = mongoose.Schema;

// blueprint of User schema
// it is local schema, only exists in node
var userSchema = new Schema({
    fName: String,
    lName: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    admin: Boolean
})

// local user template schema (local copy)
let Users;

module.exports.initialize = function(){
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true });

        // test db connection
        db.on("error", (err)=> {
            reject(err);
        });
        
        db.once("open", ()=>{
            // create a collection called users in mongoDB
            // and copy it to local variable
            Users = db.model("users", userSchema);
            resolve();
        });
    });
}

module.exports.validateLogin = function(inData){
    
    return new Promise(function(resolve, reject){

        var valid = true;
        for (let key in inData){
            if (inData.hasOwnProperty(key)){
                if (inData[key] === null || inData[key].trim().length === 0){
                    errData.loginError[key] = "This field is required.";
                    valid = false;
                } 
                else {
                    errData.loginError[key] = "";
                }
            }
        }
        
        if (valid){
            resolve();
        } 
        else {
            reject();
        }
    })
}

module.exports.validateSignup = function(inData){
    return new Promise(function(resolve, reject){
        var valid = true;
        for (let key in inData){
            if (inData.hasOwnProperty(key)){
                if (inData[key] === null || inData[key].trim().length === 0){
                    errData.signupError[key] = "This field is required.";
                    valid = false;
                } else {
                    errData.signupError[key] = "";
                }
            }
        }
        
        // if password doesn't get the error message yet, validate using other criterias
        if (errData.signupError['password'] === "") {
            var re = new RegExp("^[A-Za-z0-9]+$");
            if (inData.password.trim().length >= 6 && inData.password.trim().length <= 12) {
                if (!re.test(inData.password)) {
                    errData.signupError.password = "Password must have letters and numbers only.";
                    valid = false;
                } else {
                    errData.signupError.password = "";
                }
            } else {
                if (!re.test(inData.password)) {
                    errData.signupError.password = "Password must have letters and numbers only and must be 6 to 12 characters.";
                } else {
                    errData.signupError.password = "Password must be 6 to 12 characters.";
                } 
                valid = false;
            }
        }

        // if first name doesn't get the error message yet, validate using another criteria
        if (errData.signupError['fName'] === "") {
            var re = new RegExp("^[A-Za-z]{2,}$");
            if (!re.test(inData.fName)){
                errData.signupError.fName = "First name must have letters only and must be longer than one letter.";
                valid = false;
            } else {
                errData.signupError.fName = "";
            }
        }

        // if last name doesn't get the error message yet, validate using another criteria
        if (errData.signupError['lName'] === "") {
            var re = new RegExp("^[A-Za-z]{2,}$");
            if (!re.test(inData.lName)){
                errData.signupError.lName = "Last name must have letters only and must be longer than one letter.";
                valid = false;
            } else {
                errData.signupError.lName = "";
            }
        }
        
        // if email doesn't get the error message yet, validate using another criteria
        if (errData.signupError['email'] === "") {
            var re = new RegExp("^[A-Za-z0-9_]+\.*[A-Za-z0-9_]+@[A-Za-z0-9]+\.[A-Za-z]{2,3}$");
            if (!re.test(inData.email)){
                errData.signupError.email = "Username cannot start/end with a period & top level domain must be 2-3 characters";
                valid = false;
            } else {
                errData.signupError.email = "";
            }
        }

        if (valid){
            resolve();
        } else {
            reject();
        }
    })
}

module.exports.getUserByEmail = function(inEmail){
    return new Promise((resolve, reject)=>{
        Users.find({email: inEmail})
        .exec()
        .then((returnedUsers)=>{
            if (returnedUsers !== 0){
                resolve(returnedUsers.map(item => item.toObject()));
            } else {
                reject("No users found");
            }
        }).catch((err) => {
            console.log("Error retrieving user" + err);
            reject(err);
        });
    });
}

module.exports.addUser = function(data){
    return new Promise((resolve, reject) => {
        this.validateSignup(data).then(() => {
            // see if admin has been checked
            data.admin = (data.admin) ? true : false;
            // add data to local User collection
            // local only
            // only works if the field names are the same. (case sensitive)
            var newUser = new Users(data);
            bcrypt.genSalt(10) // generate a salt using 10 rounds
            .then(salt=>bcrypt.hash(newUser.password, salt))
            .then(hash => { // hash: encrypted password returned
                // store the hashed password to DB
                newUser.password = hash;
                console.log(newUser);
                // try to save entry to our database
                newUser.save((err)=>{
                    if (err){
                        console.log("fail to save the user!" + err);
                        reject("The user with this email already exist.");
                    } else {
                        console.log("Saved the user" + data.name);
                        resolve();
                    }
                });
            })
            .catch(err=>{
                console.log(err);
                reject("Hashing error");
            });
        });
    });
}

module.exports.validateUser = (data) => {
    return new Promise((resolve, reject) => {
        if (data){
            this.getUserByEmail(data.email).then((retUser) => {
                bcrypt.compare(data.password, retUser[0].password).then((result)=>{
                    if (result){
                        // if given data's admin is unchecked, it is undefined, so make it to false
                        data.admin = (data.admin) ? true : false;
                        // check if member type matches
                        if (data.admin === retUser[0].admin){
                            const retUserCopy = Object.assign({}, retUser[0]);
                            delete retUserCopy.password;
                            // send the object that doesn't have password
                            resolve(retUserCopy);
                        } else {
                            reject("member type doesn't match");
                        }   
                    }
                    else {
                        reject("password doesn't match");
                        return;
                    }
                });
            }).catch((err) => { // catch getUserByEmail error
                reject(err);
                return;
            })
        }
    })
}

module.exports.getErrData = function(){
    return new Promise(function(resolve, reject){
        resolve(errData);
    });       
}

var errData = {
    loginError: [
        {
            email: "",
            password: ""
        }
    ],
    signupError: [
        {
            fName: "",
            lName: "",
            email: "",
            password: ""
        }
    ]
}

module.exports.getUsers = function(){
    return new Promise((resolve, reject)=>{
        Users.find() //
        .exec() // tells mongoos that we should run findOne() as a promise
        .then((returnedUsers)=>{
            if (returnedUsers !== 0){
                resolve(returnedUsers.map(item => item.toObject()));
            } else {
                reject("No users found");
            }
        }).catch((err) => {
            console.log("Error retrieving user" + err);
            reject(err);
        });
    });
}
