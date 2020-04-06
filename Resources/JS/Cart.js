class Shop {
    constructor(element){
        this.$element = $(element);
        this.init();
    }
}

$.extend(Shop.prototype,{
    init(){
            this.cartPrefix = "artbyanc-"; // Prefix string to be prepended to the cart's name in the session storage
			this.cartName = this.cartPrefix + "cart"; // Cart name in the session storage
			// this.shippingRates = this.cartPrefix + "shipping-rates"; // Shipping rates key in the session storage
			this.total = this.cartPrefix + "total"; // Total key in the session storage
            this.storage = sessionStorage; // shortcut to the sessionStorage object
            this.currency = "&euro;";
            this.$subTotal = document.getElementsByClassName('s_total');// Element that displays the subtotal charges
            this.$quantity = document.getElementById('quantity');

            this.$formAddToCart = this.$element.find("form.add-to-cart" ); // Forms for adding items to the cart
            this.$formCart = this.$element.find(".Cart_Form");
            

            //Method Invocations
            this._createCart();
            this.AddToCartForm();
            this._displayCart();
            this._deleteItem();
            this._updateItem();

    },
    AddToCartForm(){
        var self = this;
        self.$formAddToCart.each(function (item){
            var $form = $(this);
            var $product = $form.parent().parent().parent();
            var price = self._convertString($product.data("price"));
            var name =  $product.data( "name" );
            var image = $product.data("image");

            $form.on('submit' , function(e){
                var qty = self._convertString($form.find(".qty").val());
                var subTotal = qty * price;
                var total = self._convertString(self.storage.getItem(self.total));
                var sTotal = total + subTotal;
                self.storage.setItem(self.total , sTotal);
                self._addToCart({
                    product: name,
                    image: image,
                    price: price, 
                    quantity : qty
                });
                // TODO : Have to ask Aisling about the shipping rates 


            });

        });
    },
    /*
        This method checks the inputted String and converts it to a number if it's able to be converted
        @param The inputted String
        @returns The outputted String formatted as a number
    */ 
    _convertString(numStr){
        var num;
        switch(numStr){
            case (/^[-+]?[0-9]+\.[0-9]+$/.test( numStr )): 
                num = parseFloat(numStr);
                console.log("It should be a float");
                break;
            case (/^\d+$/.test( numStr )):
                num = parseInt(numStr , 10);
                break;
            default:
                num = Number(numStr);
                break;
        }

        // isNaN returns true if variable is not a number so if it returns false then it is a number
        if (!isNaN(num)){
            return num;
        } else {
            console.warn( numStr + " cannot be converted into a number" );
			return false;
        }
    },
    /* Converts a number to a string
		 * @param n Number the number to be converted
		 * @returns str String the string returned
		 */
		
		_convertNumber: function( n ) {
			var str = n.toString();
			return str;
		},
    /*
        This method sets up and creates the cart in session storage
        @param no Inputted Values
        @returns void
    */ 
    _createCart(){
        var self = this;
        if(self.storage.getItem(self.cartName) == null){
            var cart = {};
            cart.items = [];
            self.storage.setItem(self.cartName , self._toJSONString(cart));
            self.storage.setItem(self.total , "0");
        }
    },
    /*
        This method adds the values to the cart in session storage
        @param values to be added 
        @returns void
    */ 
    _addToCart(values){
        var self = this;
        var cart = self.storage.getItem(self.cartName);
        var cartObject = self._toJSONObject(cart);
        console.log(cartObject);
        var cartCopy = cartObject;
        var items = cartCopy.items;
        items.push(values);
        self.storage.setItem(self.cartName , self._toJSONString(cartCopy));
    },
    _displayCart(){
        var self = this;
        if(this.$formCart.length){
            var cart = self._toJSONObject(self.storage.getItem(self.cartName));
            var items = cart.items;
            var $cartDisplayContainer = document.getElementsByClassName('checkoutDisplayContainers')[0];
            var $subtotalDisplayContainer = document.getElementsByClassName('bottomPart')[0];
            if(items.length == 0){
                $cartDisplayContainer.insertAdjacentHTML('beforeend',`Cart is Empty, Please Buy Something`);
            } else {
                for (var i = 0; i < items.length ; i++){
                    item = items[i];
                    let art_product = {
                        'Product_Name' : item.product,
                        'Image_Link': item.image,
                        'Quantity' : item.quantity,
                        'Price' :  item.price
                    };
                    $cartDisplayContainer.insertAdjacentHTML('beforeend',`
                        <div class="checkoutDisplayContainer" data-product="${art_product.Product_Name}" data-quantity="${art_product.Quantity}" data-price="${art_product.Price}" data-image="${art_product.Image_Link}">
                                <img src="${art_product.Image_Link}" alt="">
                                <div class="detailsCart">
                                    <h3>${art_product.Product_Name}</h3>
                                </div>
                                <div class="amountCartContainer">
                                    <a class="btn-update plus" href="">+</a>
                                    <input type="text" id="quantity" name="quantity" value="${art_product.Quantity}" readonly="true">
                                    <a class="btn-update minus" href="">-</a>
                                </div>
                                <div class="priceCartContainer">
                                    <h5>€</h5>
                                    <h2>${art_product.Price}</h2>
                                </div>
                                <div class="XContainer">
                                    <a href="" class="remove-btn">X</a>
                                </div> 
                        </div>
                    `);
                }
            }
            if(items.length == 0){
                $subtotalDisplayContainer.insertAdjacentHTML('afterbegin' , `${self.currency + self.storage.getItem(self.total)}.00`);
            } else {
                $subtotalDisplayContainer.insertAdjacentHTML('afterbegin' , `
                    <div class="subtotal_label">
                        <span>
                            <h5>Subtotal:</h5>
                            <h3 class="s_total">${self.currency + self.storage.getItem(self.total)}.00</h3>
                        </span>
                    </div>
                `);
            }

        }
    },
    /*
        This method removes the item to the cart in session storage
        @param void
        @returns void
    */ 
    _deleteItem(){
        var self = this;
        if(self.$formCart.length){
            var cart = self._toJSONObject(self.storage.getItem(self.cartName));
            var items = cart.items;
            $(document).on('click', '.remove-btn', function(e){
                e.preventDefault();
                var product_clicked = $(this).parent().parent().data("product");
                var newItems = [];
                for(var i = 0; i < items.length ; i++){
                    var item = items[i];
                    var name = item.product;
                    if (name == product_clicked){
                        items.splice(i , 1);
                    }
                }
                newItems = items;
                var newCart = {};
                newCart.items = newItems;
                var updatedTotal = 0;
                if(newItems.length < 0){
                    updatedTotal = 0;
                } else {
                    for(var i= 0; i < newItems.length ; i++){
                        var item = newItems[i];
                        let sub = item.price * item.quantity;
                        updatedTotal += sub;
                    }
                }
                self.storage.setItem(self.total, self._convertNumber(updatedTotal));
                self.storage.setItem(self.cartName , self._toJSONString(newCart));
                $(this).parent().parent().remove();
                self.$subTotal[0].innerHTML = self.currency + self.storage.getItem(self.total) + ".00";
            });
        }

    },
    /*
        This method updates the item to the cart in session storage
        @param void
        @returns void
    */ 
    _updateItem: function (){
        var self = this;
        // var cart = self._toJSONObject(self.storage.getItem(self.cartName));
        // var items = cart.items;
        $(document).on('click' , '.btn-update' , function(e){
            e.preventDefault();
            var button_clicked = $(this);
            if(button_clicked[0].classList.contains("plus")){
                console.log("yeah that's right , add it on");
                quantity += 1;
                console.log(quantity);  
            }
            // e.preventDefault();
            // var product_clicked = $(this).parent().parent().data("product");
            // var newItems = [];
            // for(var o = 0; o < items.length; o++){
            //     var item = items[0];
            //     var name = item.product;
            //     var quantity = item.quantity;
            //     if(name == product_clicked){
            //         // console.log(this);
            //         var button_clicked = $(this);
            //         // console.log(button_clicked);
            //         // if(button_clicked[0].classList.contains("minus")){
            //         //     if (quantity == 1){
            //         //         quantity = 1;
            //         //     } else {
            //         //         console.log("yeah that's right , take it away ");
            //         //         quantity -= 1;
            //         //     }
            //         // }
            //         if(button_clicked[0].classList.contains("plus")){
            //             console.log("yeah that's right , add it on");
            //             quantity += 1;
            //             console.log(quantity);  
            //         }
                    
            //     }
            // }
            // newItems = items;
            // console.log(newItems);
            // var newCart = {};
            // newCart.items = newItems;
            // var updatedTotal = 0;
            // if(newItems.length < 0){
            //     updatedTotal = 0;
            // } else {
            //     for(var i= 0; i < newItems.length ; i++){
            //         var item = newItems[i];
            //         let sub = item.price * item.quantity;
            //         updatedTotal += sub;
            //     }
            // }
            // self.storage.setItem(self.total, self._convertNumber(updatedTotal));
            // self.storage.setItem(self.cartName , self._toJSONString(newCart));
            // console.log(quantity);
            // // console.log(self.$quantity);
            // // console.log(self.$quantity.value);
            // // self.$quantity.value = quantity;
            var Quantity_Element = document.getElementById('quantity');
            Quantity_Element.value = quantity;

            self._updateItem();

        });

    },
    /*
        This method converts a JSON String to an Object
        @param Inputted JSON String
        @returns Outputted Javscript Object
    */ 
    _toJSONObject(str){
        var obj = JSON.parse(str);
        return obj;
    },
    /*
        This method converts a Javascript Object to a JSON String 
        @param Inputted Javascript Object
        @returns Outputted JSON String
    */ 
    _toJSONString(obj){
        var str = JSON.stringify(obj);
        return str;
    }

});
window.onload = function (){
    var shop = new Shop("#Whole_Site");
    
}












