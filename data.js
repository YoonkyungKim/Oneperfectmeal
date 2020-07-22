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

var data = {
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
