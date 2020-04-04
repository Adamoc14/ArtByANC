class Shop {
    constructor(element){
        this.$element = $(element);
        this.init();
    }
}

$.extend(Shop.prototype,{
    init(){
            this.cartPrefix = "winery-"; // Prefix string to be prepended to the cart's name in the session storage
			this.cartName = this.cartPrefix + "cart"; // Cart name in the session storage
			this.shippingRates = this.cartPrefix + "shipping-rates"; // Shipping rates key in the session storage
			this.total = this.cartPrefix + "total"; // Total key in the session storage
            this.storage = sessionStorage; // shortcut to the sessionStorage object

            this.$formAddToCart = this.$element.find( "form.add-to-cart" ); // Forms for adding items to the cart
            // console.log(this.$formAddToCart);
            this.$formCart = this.$element.find(".Cart_Form");
            // console.log(this.$formCart);
            

            //Method Invocations
            this._createCart();
            this.AddToCartForm();

    },
    AddToCartForm(){
        var self = this;
        self.$formAddToCart.each(function (item){
            var $form = $(this);
            var $product = $form.parent().parent().parent();
            var price = self._convertString($product.data("price"));
            var name =  $product.data( "name" );

            $form.on('submit' , function(e){
                // e.preventDefault();
                var qty = self._convertString($form.find(".qty").val());
                var subTotal = qty * price;
                var total = self._convertString(self.storage.getItem(self.total));
                var sTotal = total + subTotal;
                self.storage.setItem(self.total , sTotal);
                self._addToCart({
                    product: name,
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
        //Problem here with setting the cartName to equal a JSON Object 
        var cart = self.storage.getItem(self.cartName);
        var cartObject = self._toJSONObject(cart);
        console.log(cartObject);
        var cartCopy = cartObject;
        var items = cartCopy.items;
        items.push(values);
        self.storage.setItem(self.cartName , self._toJSONString(cartCopy));
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








{/* <img src="../../Resources/Images/Abstract_Images/Abstract_Cow.jpg" alt="">
<div class="detailsCart">
    <h3>Abstract Cow</h3>
</div>
<div class="amountCartContainer">
    <a class="plus" href="">+</a>
    <input type="text" id="quantity" name="quantity" id="" value="1" readonly="true">
    <a class="minus" href="">-</a>
</div>
<div class="priceCartContainer">
    <h5>€</h5>
    <h2>25.00</h2>
</div>
<div class="XContainer">
    <a href="" class="remove-btn">X</a>
</div> */}


