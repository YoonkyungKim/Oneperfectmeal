// Sources I retrieved
// free img sources:
// https://www.freepik.com/
// https://unsplash.com/

// social media icons:
// https://fontawesome.com/

module.exports.getLocalData = function(){
    return new Promise(function(resolve, reject){
        resolve(data);
    });       
}

var data = {
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
        },
        {
            page: "welcome",
            text: "Welcome to Oneperfectmeal!",
            img: "./img/banner-4.jpg",
            imgAlt: "welcome-hero",
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
    ],
    singleMeal: [
        {
            name: "Tofu",
            price: 12.99,
            category: "protein",
            synopsis: "Grilled tofu with mushrooms",
        },
        {
            name: "Eggs",
            price: 14.99,
            category: "protein",
            synopsis: "Eggs cooked in the style you want"
        },
        {
            name: "Pancakes",
            price: 11.99,
            category: "breakfast",
            synopsis: "Pancakes with banana and maple syrup"
        },
        {
            name: "Chicken",
            price: 15.99,
            category: "protein",
            synopsis: "Fried chicken with potatos"
        }
    ]
}
