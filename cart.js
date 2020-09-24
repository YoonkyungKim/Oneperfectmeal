var cart = [];

// adds item with multiple numbers to the cart
module.exports.addMtpItems = (inItem, inNoOfItems)=>{
    console.log("Add items to cart " + inItem.mealPNumber);
    console.log("noOfItems: " + inNoOfItems);
    return new Promise((resolve, reject)=>{
        var exist = false;
        cart.forEach(x=> {
            if (x.mealPNumber === inItem.mealPNumber){
                x.itemCount += inNoOfItems;
                exist = true;
            }
        })
        if (!exist){
            inItem.itemCount = inNoOfItems;
            cart.push(inItem);
        }
        // console.log(cart);
        var count = 0;
        cart.forEach(x=> {
            count += x.itemCount;
        })
        resolve(count);
    });
}

module.exports.increaseItem = (inItem)=>{
    console.log("increase item " + inItem.mealPNumber);
    return new Promise((resolve,reject)=>{
        cart.forEach(x=> {
            if (x.mealPNumber === inItem.mealPNumber){
                x.itemCount++;
            }
        })
        resolve();
    });
}

// remove a given item and decrease item qty by 1 from the cart
module.exports.decreaseItem = (inItem)=>{
    console.log("decrease item " + inItem.mealPNumber);
    return new Promise((resolve,reject)=>{
        for (var i = 0; i < cart.length; i++){
            if (cart[i].mealPNumber === inItem.mealPNumber){
                cart[i].itemCount--;
                if (cart[i].itemCount === 0){
                    this.removeItem(cart[i].mealPNumber);
                }
            }
        }
        resolve();
    });
}

//removes all items with the same mealPNumber (=same product) from the cart
module.exports.removeItem = (inItem)=>{
    return new Promise((resolve,reject)=>{
        for(var i = 0; i < cart.length; i++){
            if (cart[i].mealPNumber === parseInt(inItem)){
                console.log("same item exist!");
                cart.splice(i, 1);
                i = cart.length;
            }
        }
        // console.log(cart);
        resolve();
    });
}


//returns cart array
module.exports.getCart = ()=>{
    return new Promise((resolve, reject)=>{
        resolve(cart);
    });
}

//calculates the price of all items in the cart
module.exports.checkout = ()=>{
    return new Promise((resolve, reject)=>{
        var price = 0;
        if (cart) {
            cart.forEach(x => {
                price += x.price * x.itemCount;
            });
        }
        resolve(price.toFixed(2)); // 2 decimal places
    });
}

// count every item
module.exports.countItems = ()=>{
    return new Promise((resolve, reject)=>{
        var count = 0;
        if (cart) {
            cart.forEach(x => {
                count += x.itemCount;
            });
        }
        resolve(count); 
    });
}

// count one item
module.exports.countItem = (inItem)=>{
    return new Promise((resolve, reject)=>{
        var count = 0;
        cart.forEach(x => {
            if (x.mealPNumber === inItem.mealPNumber){
                count = x.itemCount;
            }
        })
        resolve(count); 
    });
}

// empty cart
module.exports.emptyCart = ()=>{
    return new Promise((resolve, reject)=>{
        cart = [];
        resolve(cart);
    });
}