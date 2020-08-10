const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { resolve } = require("path");
mongoose.set('useCreateIndex', true);

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

var mealPackageSchema = new Schema({
    mealPNumber: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: String,
    noOfMeals: {
        type: Number,
        required: true
    },
    topPackage: Boolean,
    image: String
})

// local user template schema (local copy)
let Users;

let MealPackages;

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
            MealPackages = db.model("mealPackages", mealPackageSchema);
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
                errData.signupError.email = "Username must be at least 2 characters that don't start/end with a period & top level domain must be 2-3 characters";
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
        // by default, admin is false. If you want to set the user to data clerk, change admin value manually in Atlas
        data.admin = false;
        // add data to local User collection
        // local only
        // only works if the field names are the same. (case sensitive)
        var newUser = new Users(data);
        bcrypt.genSalt(10) // generate a salt using 10 rounds
        .then(salt=>bcrypt.hash(newUser.password, salt))
        .then(hash => { // hash: encrypted password returned
            // store the hashed password to DB
            newUser.password = hash;
            // console.log(newUser);
            // try to save entry to our database
            newUser.save((err)=>{
                if (err){
                    console.log("fail to save the user!" + err);
                    reject("The user with this email already exists.");
                } else {
                    console.log("Saved the user" + data.fName);
                    resolve();
                }
            });
        })
        .catch(err=>{
            console.log(err);
            reject("Hashing error");
        });
    })
}

module.exports.validateUser = (data) => {
    return new Promise((resolve, reject) => {
        if (data){
            this.getUserByEmail(data.email).then((retUser) => {
                bcrypt.compare(data.password, retUser[0].password).then((result)=>{
                    if (result){
                        const retUserCopy = Object.assign({}, retUser[0]);
                        delete retUserCopy.password;
                        // send the object that doesn't have password
                        resolve(retUserCopy);  
                    }
                    else {
                        reject("password doesn't match");
                        return;
                    }
                }).catch(()=>{
                    console.log("bcrypt compare error");
                })
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
    ],
    mealPError: [
        {
            mealPNumber: "",
            name: "",
            price: "",
            description: "",
            noOfMeals: ""
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

module.exports.addMealPackage = function(data){
    return new Promise((resolve, reject) => {

        // see if topPackage has been checked
        data.topPackage = (data.topPackage) ? true : false;

        //set data to null if it is an empty string ""
        for (var field in data){
            if (data[field] == "")
                data[field] = null;
        }

        // add data to local MealPackage collection
        // local only
        // only works if the field names are the same. (case sensitive)
        var newMealPackage = new MealPackages(data);
        
        // try to save entry to our database
        newMealPackage.save((err)=>{
            for (field in errData.mealPError){
                errData.mealPError[field] = "";
            }
            if (err){
                console.log("fail to save the meal package! " + err);
                if (err.name === 'ValidationError'){
                    for (field in err.errors){
                        errData.mealPError[field] = "This field is required.";
                    }
                }
                if (err.code === 11000){
                    errData.mealPError['mealPNumber'] = "Meal package with this number already exists.";
                }
                reject(err.name);
            } else {
                console.log("Saved the meal package " + data.name);
                resolve();
            }
        });
    })
}

module.exports.getMealPackages = function(){
    return new Promise((resolve, reject)=>{
        MealPackages.find() //
        .exec() // tells mongoos that we should run find() as a promise
        .then((returnedMealPackages)=>{
            if (returnedMealPackages !== 0){
                resolve(returnedMealPackages.map(item => item.toObject()));
            } else {
                reject("No meal packages found");
            }
        }).catch((err) => {
            console.log("Error retrieving meal package" + err);
            reject(err);
        });
    });
}

module.exports.getMealByName = function(inName){
    return new Promise((resolve,reject)=>{
        MealPackages.findOne({name: inName})
        .exec() //run findOne as a promise.
        .then((returnedMealP)=>{
            if(returnedMealP){
                returnedMealP = returnedMealP.toObject();
                // console.log(returnedMealP);
                resolve(returnedMealP);
            }
            else{
                reject("No meal package found");
            } 
        }).catch((err)=>{
            console.log("Error Retriving meal package: " + err);
            reject(err);
        });
    });
}

module.exports.getMealByNumber = function(inNumber){
    return new Promise((resolve,reject)=>{
        MealPackages.findOne({mealPNumber: inNumber})
        .exec() //run findOne as a promise.
        .then((returnedMealP)=>{
            if(returnedMealP){
                returnedMealP = returnedMealP.toObject();
                // console.log(returnedMealP);
                resolve(returnedMealP);
            }
            else{
                reject("No meal package found");
            } 
        }).catch((err)=>{
            console.log("Error Retriving meal package: " + err);
            reject(err);
        });
    });
}

module.exports.editMealPackage = (editData)=>{
    // var errMsg;
    return new Promise((resolve, reject)=>{
        editData.topPackage = (editData.topPackage) ? true : false;
        
        MealPackages.updateOne(
        {mealPNumber : editData.mealPNumber},
        {$set: {  //fields we updates
            name: editData.name,
            price: editData.price,
            description: editData.description,
            category: editData.category,
            noOfMeals: editData.noOfMeals,
            topPackage: editData.topPackage,
            image: editData.image
        }}, //find entry using name field
        { runValidators: true }, function(err){
            if (err && err.name === 'ValidationError'){
                for (field in err.errors){
                    errData.mealPError[field] = "This field is required.";
                }
            }
        },//validate inputs
        )
        .exec() //calls the updateOne as a promise
        .then(()=>{
            console.log(`Meal package ${editData.name} has been updated`);
            resolve();
        }).catch((err)=>{
            console.log(err.name);
            reject(err.name);
        });
    });
}