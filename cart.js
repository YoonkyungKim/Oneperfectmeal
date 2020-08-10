var cart = [];

// adds an item to the cart
module.exports.addItem = (inItem)=>{
    console.log("Add to cart " + inItem.mealPNumber);
    return new Promise((resolve,reject)=>{
        cart.push(inItem);
        resolve(cart.length);
    });
}

// remove a given item and decrease item qty by 1 from the cart
module.exports.decreaseItem = (inItem)=>{
    return new Promise((resolve,reject)=>{
        for(var i = 0; i < cart.length; i++){
            if(cart[i].mealPNumber == inItem){
                cart.splice(i, 1);
                i = cart.length;
            }
        }
        resolve();
    });
}

//removes all items with the same mealPNumber (=same product) from the cart
module.exports.removeItem = (inItem)=>{
    return new Promise((resolve,reject)=>{
        for(var i = 0; i < cart.length; i++){
            if (cart[i].mealPNumber == inItem){
                cart.splice(i, 1);
                i = i - 1;
            }
        }
        console.log(cart.length);
        resolve();
    });
}


//returns the cart array with all items (there are duplicates)
module.exports.getCart = ()=>{
    return new Promise((resolve, reject)=>{
        resolve(cart);
    });
}

//returns the cart array with unique items (one item is included only once)
module.exports.getUniqueCart = ()=>{
    return new Promise((resolve, reject)=>{
        uniqueCart = [];
        // only add if array doesn't have the same item (item with the same mealPNumber) 
        cart.forEach(x=> {
            if (!uniqueCart.some(item => item.mealPNumber === x.mealPNumber)){
                uniqueCart.push(x);
            }
        })
        resolve(uniqueCart);
    });
}

//calculates the price of all items in the cart
module.exports.checkout = ()=>{
    return new Promise((resolve, reject)=>{
        var price = 0;
        if (cart) {
            cart.forEach(x => {
                price += x.price;
            });
        }
        resolve(price.toFixed(2)); // 2 decimal places
    });
}

//counts every item
module.exports.everyItemCount = (inCart)=>{
    return new Promise((resolve, reject)=>{        
        if (cart) {
            var count = 0;
            cart.forEach(x => {
                x.itemCount = 0;
            });

            cart.forEach(x => {
                inCart.forEach(y => {
                    if (x.mealPNumber === y.mealPNumber){
                        x.itemCount++;
                        count++;
                    }
                })
            });
        }
        // console.log("current item count: " + count);
        resolve();
    });
}

// empty cart
module.exports.emptyCart = ()=>{
    return new Promise((resolve, reject)=>{
        cart = [];
        resolve(cart);
    });
}