// Sources I retrieved
// free img sources:
// https://www.freepik.com/
// https://unsplash.com/

// social media icons:
// https://fontawesome.com/

module.exports.getData = function(){
    return new Promise(function(resolve, reject){
        resolve(data);
    });       
}

module.exports.validateLogin = function(inData){
    
    return new Promise(function(resolve, reject){

        var valid = true;
        for (let key in inData){
            if (inData.hasOwnProperty(key)){
                if (inData[key] === null || inData[key].trim().length === 0){
                    data.loginError[key] = "This field is required.";
                    valid = false;
                } else {
                    data.loginError[key] = "";
                }
            }
        }

        if (valid){
            resolve();
        } else {
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
                    data.signupError[key] = "This field is required.";
                    // console.log(data.errorMessages[key]);
                    valid = false;
                } else {
                    data.signupError[key] = "";
                }
            }
        }
        
        // if password doesn't get the error message yet, validate using other criterias
        if (data.errorMessages['password'] === "") {
            var re = new RegExp("^[A-Za-z0-9]+$");
            if (inData.password.trim().length >= 6 && inData.password.trim().length <= 12) {
                if (!re.test(inData.password)) {
                    data.signupError.password = "Password must have letters and numbers only.";
                    valid = false;
                } else {
                    data.signupError.password = "";
                }
            } else {
                if (!re.test(inData.password)) {
                    data.signupError.password = "Password must have letters and numbers only and must be 6 to 12 characters.";
                } else {
                    data.signupError.password = "Password must be 6 to 12 characters.";
                } 
                valid = false;
            }
        }
        
        console.log(data.signupError['password']);

        if (valid){
            resolve();
        } else {
            reject();
        }
    })
}

module.exports.storeUserInfo = function(inData){
    return new Promise(function(resolve, reject){
        data.user.push(inData);
        resolve();
    })
}

var data = {
    user: [],
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
    mealPackage: [
        {
            name: "Protein-Rich",
            img: "./img/mp-1.png",
            price: 129.99,
            category: "Meat",
            noOfMeals: 15,
            synopsis: "A protein-rich package great for strength and muscle development",
            topPackage: true
        },
        {
            name: "Happy Weekend",
            img: "./img/mp-2.png",
            price: 149.99,
            category: "Meat",
            noOfMeals: 15,
            synopsis: "A meal package full of stimulating and enjoyable tastes to enjoy on weekends",
            topPackage: false
        },
        {
            name: "Pleasant Vegan",
            img: "./img/mp-3.png",
            price: 159.99,
            category: "Vegan",
            noOfMeals: 15,
            synopsis: "A complete vegan package contists of various vegetables and vegan meat",
            topPackage: true
        },
        {
            name: "Soft Daily",
            img: "./img/mp-4.png",
            price: 129.99,
            category: "Vegetarian",
            noOfMeals: 15,
            synopsis: "A meal package consisting of soft, non-irritating food that is easy to digest",
            topPackage: true
        },
        {
            name: "Tofu & Eggs",
            img: "./img/mp-5.png",
            price: 129.99,
            category: "Protein",
            noOfMeals: 15,
            synopsis: "A package consists of tofu and eggs dishes",
            topPackage: true
        },
        {
            name: "Happy Breakfast",
            img: "./img/mp-6.png",
            price: 99.99,
            category: "Breakfast",
            noOfMeals: 15,
            synopsis: "Eggs, bacons, pancakes, milk and more!",
            topPackage: false
        },
        {
            name: "All the veggies",
            img: "./img/mp-7.png",
            price: 129.99,
            category: "Vegan",
            noOfMeals: 15,
            synopsis: "A package contains a full of various kinds of veggies",
            topPackage: false
        },
        {
            name: "Roast Beef",
            img: "./img/mp-8.png",
            price: 129.99,
            category: "Meat",
            noOfMeals: 15,
            synopsis: "A protein-rich package that contains roast beef dishes",
            topPackage: false
        }
    ],
    hero: [
        {
            page: "home",
            text: "One Meal Will Make Your Day.",
            img: "./img/hero-1.jpg",
            imgAlt: "meal-sample",
            button: true
        },
        {
            page: "mealPackage",
            text: "Meal Packages",
            img: "./img/hero-2.jpg",
            imgAlt: "meal-sample",
            button: false
        },
        {
            page: "register",
            text: "Sign Up",
            img: "./img/banner-3.jpg",
            imgAlt: "register-hero",
            button: false
        },
        {
            page: "login",
            text: "Log in",
            img: "./img/banner-2.jpg",
            imgAlt: "login-hero",
            button: false
        }
    ],
    content: [
        {
            title: "Choose",
            img: "./img/content-1.jpg",
            imgAlt: "Choose-image",
            text: "Various & colorful dishes"
        }, 
        {
            title: "Cook",
            img: "./img/content-2.jpg",
            imgAlt: "Cook-image",
            text: "Deliver hot food just made"
        },
        {
            title: "Dine",
            img: "./img/content-3.jpg",
            imgAlt: "Dine-image",
            text: "Enjoy a quality meal"
        },
        {
            title: "Replay!",
            img: "./img/content-4.jpg",
            imgAlt: "Replay-image",
            text: "Subscribe whenever you want"
        }
    ]
}