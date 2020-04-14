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
            this.$quantity = 0;
            this.$formAddToCart = this.$element.find("form.add-to-cart" ); // Forms for adding items to the cart
            this.$formCart = this.$element.find(".Cart_Form");

            this.users = this.cartPrefix + "users";
            this.usersTotal = this.cartPrefix + "usersTotal";
            this.$userForm = this.$element.find(".Checkout_Form");

            //Paypal Stuff
            this.paypalCurrency = "EUR"; // PayPal's currency code
			this.paypalBusinessEmail = "yourbusiness@email.com"; // Your Business PayPal's account email address
			this.paypalURL = "https://www.sandbox.paypal.com/cgi-bin/webscr"; // The URL of the PayPal's form

            // Object containing patterns for form validation
			this.requiredFields = {
				expression: {
                    email_value: /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]){2,4}$/,
                    telephone_value: /^\d{10}$/
				},
				
				str: {
					value: ""
				}
				
			};
            

            //Method Invocations
            
            this._createCart();
            this._createUsers();
            this._AddUserForm();
            this._AddToCartForm();
            this._displayCart();
            this._deleteItem();
            this._updateItem();
            this._populateUserFormData();
            this._populatePaypalFormData();

    },

    _AddToCartForm(){
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
        This method cretaes the List Of Users Session Variable 
        @param 
        @returns 
    */ 
   _createUsers(){
       var self = this;
       if(self.storage.getItem(self.users) == null){
           var users = {};
           users.items = [];
           self.storage.setItem(self.users , self._toJSONString(users));
           self.storage.setItem(self.usersTotal , '0');
       }
   },
   /*
        This method adds A new User to the List Of Users Session Variable 
        @param 
        @returns 
    */ 
   _validateForm(form){
       var self = this;
       var fields = self.requiredFields;
       var $errorContainer = document.getElementsByClassName('errorContainer')[0];
       var $inputs = form.find('.Inputs');
       var valid = true;
       $inputs.each(function(){
           var $input = $(this).find('input');
           var $select = document.getElementsByTagName('select')[0];

            for(var i = 0; i < $input.length ; i++){
                var input_jq = $($input[i]);
                var message = input_jq.data("message");
                var type = input_jq.data("type");
                var textContainer = "";
                if(type == "string"){
                    if($input[i].value != fields.str.value){
                        // console.log("I have a value babyyyy :) ");
                        if(input_jq.parent()[0].classList.contains("F_Name") || input_jq.parent()[0].classList.contains("L_Name")){
                            input_jq.parent().parent().prev().children(".red_dot").remove();
                        } else {
                            input_jq.prev().children(".red_dot").remove();
                        }
                        $($errorContainer).css('display','none');
                    } else {
                        // console.log("I don't have a value :(");
                        if(input_jq.parent()[0].classList.contains("F_Name") || input_jq.parent()[0].classList.contains("L_Name")){
                            input_jq.parent().parent().prev().children(".red_dot").remove();
                            textContainer = input_jq.parent().parent().prev();
                            textContainer[0].insertAdjacentHTML('beforeend',`
                                <span class='red_dot dot'>*</span>
                            `);
                        } else {
                            input_jq.prev().children(".red_dot").remove();
                            textContainer = input_jq.prev();
                            textContainer[0].insertAdjacentHTML('beforeend',`
                                <span class='red_dot dot'>*</span>
                            `);
                        }
                        $($errorContainer).text( "*" + message)
                        valid = false;
                    }
                    if($select.options.selectedIndex != 0){
                        // console.log("I have a picked a value :)");
                        $($select).prev().children(".red_dot").remove(); 
                    } else {
                        // console.log("I have not a picked a value :(");
                        $($select).prev().children(".red_dot").remove();
                        textContainer = $($select).prev();
                        textContainer[0].insertAdjacentHTML('beforeend',`
                            <span class='red_dot dot'>*</span>
                        `);
                        $($errorContainer).css('display','flex');
                        $($errorContainer).text("*" + message);
                        valid = false;  
                    }
                } else if (type == "expression"){
                    if(fields.expression.telephone_value.test($input[i].value) ){
                        // console.log("I have a valid telephone Number :)");
                        input_jq.prev().children(".red_dot").remove(); 
                    } else if(fields.expression.email_value.test($input[i].value) ) {
                        // console.log("I have a valid email :)");
                        input_jq.prev().children(".red_dot").remove(); 
                    } else{
                        // console.log("I don't have a valid email or mobile number :(");
                        input_jq.prev().children(".red_dot").remove();
                        textContainer = input_jq.prev();
                        textContainer[0].insertAdjacentHTML('beforeend',`
                            <span class='red_dot dot'>*</span>
                        `);
                        $($errorContainer).css('display','flex');
                        $($errorContainer).text("*" + message)
                        valid = false;
                    }
                }
            }
            
            
       });
       return valid;
   },
   /*
        This method adds A new User to the List Of Users Session Variable 
        @param 
        @returns 
    */ 
   _AddUserForm(){
       var self = this;
       self.$userForm.each(function(element){
           var $form = $(this);
           var form = $(this).find('input');
           var $select = document.getElementsByTagName('select')[0];
           var firstName, lastName, Email, Address1, Address2, TownOrCity, County, PostCode, Mobile;
           $form.on('submit', function(e){
            //e.preventDefault();
            var formSubmitted = self._validateForm($form);
            County = $select.options.selectedIndex;
            for(var i = 0; i < form.length - 1; i++){
               console.log(form[i]);
               var $input = $(form[i]);
               console.log($input.val());
               console.log($input.attr('name'));
               switch($input.attr('name')){
                    case "First_Name_Input":
                       firstName = $input.val();
                       break;
                    case "Last_Name_Input":
                        lastName = $input.val();
                        break;
                    case "Email_Input":
                        Email = $input.val();
                        break;
                    case "Address_Line1_Input":
                        Address1 = $input.val();
                        break;
                    case "Address_Line2_Input":
                        Address2 = $input.val();
                        break;
                    case "TownOrCity_Input":
                        TownOrCity = $input.val();
                        break;
                    case "PostCode_Input":
                        PostCode = $input.val();
                        break;
                    case "Telephone_Input":
                        Mobile = $input.val();
                        break;
                    default:
                        break;
               }
            }
            // console.log(firstName , lastName  , Email , Address1 , Address2 , TownOrCity , County , PostCode , Mobile );
            var user = {
                'Name': firstName + " " + lastName,
                'Email': Email,
                'Address': Address1 + " " + Address2,
                'Town/City': TownOrCity,
                'County': County,
                'PostCode': PostCode,
                'Mobile': Mobile,
            }
            console.log(user);
            if(formSubmitted){
                console.log("Form is submitted and user is Confirmed");
                self._addUser(user);
            } else {
                e.preventDefault();
                console.log("Form is submitted is " + formSubmitted);
            }
            // console.log(self._toJSONObject(self.storage.getItem(self.users)));
        });
    });

   },
   /*
        This method adds A new User to the List Of Users Session Variable 
        @param 
        @returns 
    */ 
   _addUser(user){
        var self = this;
        console.log(user);
        var users = self.storage.getItem(self.users);
        var usersObject = self._toJSONObject(users);
        console.log(usersObject);
        var userCopy = usersObject;
        var items = userCopy.items;
        items.push(user);
        self.storage.setItem(self.users , self._toJSONString(userCopy));
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
                //console.log("It should be a float");
                break;
            case (/^\d+$/.test( numStr )):
                num = parseInt(numStr , 10);
                //console.log("It should be an integer");
                break;
            default:
                num = Number(numStr);
                //console.log("It should be a normal number");
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
            self.storage.setItem(self.total , "0.00");
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
    _updateQuantityBox(clicked_element , product_clicked , item_quantity){
        var new_quantity;
        var quantity = item_quantity;
        if(clicked_element.classList.contains("plus")){
                quantity += 1;
        } else if(clicked_element.classList.contains("minus")){
            if (quantity == 1){
                quantity = 1;
            } else {
                quantity -= 1;
            }
        } 
        new_quantity = quantity;
        var quantity_box = $(product_clicked).find('#quantity');
        $(quantity_box).val(this._convertNumber(new_quantity));
        return new_quantity;
    },
    /*
        This method updates the item to the cart in session storage
        @param void
        @returns void
    */ 
    _updateItem(){
        var self = this;
        var cart = self._toJSONObject(self.storage.getItem(self.cartName));
        var items = cart.items;
        $(document).on('click' , '.btn-update' , function(e){
            e.preventDefault();
            var button_clicked = this;
            var product_clicked = $(button_clicked).parent().parent();
            var product_clicked_name = $(button_clicked).parent().parent().data("product");
            var newItems = [];
            for(var o = 0; o < items.length; o++){
                var item = items[o];
                var name = item.product;
                if(name == product_clicked_name){
                    console.log("The session name for this product is " + name + "and the name of product who's button is pressed is " + product_clicked_name);
                    var new_quantity = self._updateQuantityBox(button_clicked, product_clicked , item.quantity);
                    item.quantity = new_quantity;
                    console.log(item.quantity);
                }
            }
            newItems = items;
            console.log(newItems);
            var newCart = {};
            newCart.items = newItems;
            console.log(newCart.items);
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
            self.$subTotal[0].innerHTML = self.currency + self.storage.getItem(self.total) + ".00";
        });

    },

    /*
        This method checks whether the billing name is in the session therefore has it used our site before
        If so , fills the respective fields
        @param 
        @returns
    */ 
   _populateUserFormData(){
        var self = this;
        var $runningTotalContainer = "";
        if (document.getElementsByClassName('Running_Total_Container')[0]){
            $runningTotalContainer = document.getElementsByClassName('Running_Total_Container')[0];
            if(self.storage.getItem(self.total) != null){
                $runningTotalContainer.insertAdjacentHTML('afterbegin', `
                    <img src="../../Resources/Images/General_Images/ANCBlueLogo.jpg" alt="">
                    <h2>Total: ${this.currency + this.storage.getItem(self.total)} .00</h2>
                `);
            }
        }
        
        /* TO DO : Cookies - Discuss it with Aisling */
        // var user = {
        //     'Name': $('First_Name_Input').val() + " " + $('Last_Name_Input').val(),
        //     'Email': $('Email_Input').val(),
        //     'Address': $('Address_Line1_Input').val() + " " + $('Address_Line2_Input').val(),
        //     'Town/City': $('TownOrCity_Input').val(),
        //     'County': $('County_Selector').val(),
        //     'PostCode': $('PostCode_Input').val(),
        //     'Mobile': $('Telephone_Input').val(),
        // }
        // //console.log(user);
        // // if(Cookies.get('Users') != undefined){
        // //    var users = self._toJSONObject(Cookies.get('Users'));
        // //    console.log(users); 
        // // }

   },
    /*
        This method converts a JSON String to an Object
        @param Inputted JSON String
        @returns Outputted Javscript Object
    */ 
    _toJSONObject(str){
        var obj = JSON.parse(str);
        //console.log(obj);
        return obj;
    },
    /*
        This method converts a Javascript Object to a JSON String 
        @param Inputted Javascript Object
        @returns Outputted JSON String
    */ 
    _toJSONString(obj){
        var str = JSON.stringify(obj);
        //console.log(str);
        return str;
    },
    _populatePaypalFormData(){
        if (document.getElementById('paypal-button')){
            var self = this;
            var transactionTotal = self.storage.getItem(self.total);
            var paypalCurrency = self.paypalCurrency;

            var cart = self._toJSONObject(self.storage.getItem(self.cartName));
            var items = cart.items;
            console.log(items);
            var temporary_items = [];
            var item = {};

            for (var y = 0; y< items.length ; y++){
                var temporary_item = items[y];
                var name  , description , price , quantity , currency;
                name = temporary_item.product;
                description = temporary_item.product;
                price = temporary_item.price;
                quantity = temporary_item.quantity;
                currency = paypalCurrency;
                item = {
                    name : name,
                    description: description,
                    price: price,
                    quantity: quantity,
                    currency: currency
                };
                temporary_items.push(item);
            }
            console.log(item);

            var list_users = self._toJSONObject(self.storage.getItem(self.users));
            var users = list_users.items;
            console.log(users);
            var user = {};

            
            /*
                This may become a problem , as the user could simultaneously be using 
                the site at the same time which could lead to the last user being used 
                and that not being the person who ordered the products
            */
            for (var i = 0; i < users.length ; i++){
                var temporary_user = users[i];
                var name , Address, TownOrCity , County , PostCode , PhoneNo
                name = temporary_user.Name;
                Address = temporary_user.Address;
                TownOrCity = temporary_user['Town/City'];
                County = temporary_user.County;
                PostCode = temporary_user.PostCode;
                PhoneNo = temporary_user.Mobile;
                user = {
                    recipient_name: name,
                    line1: Address,
                    city: TownOrCity,
                    country_code: 'IE',
                    postal_code: PostCode,
                    phone: PhoneNo, 
                }   
            }
            console.log(user);
            
            var transaction = {
                transactions: [{
                    amount: {
                        total: transactionTotal,
                        currency: paypalCurrency,
                    },
                    description: 'Transactions of products from ArtByANC Art Productions Website',
                    // custom: '90048630024435',
                    //invoice_number: '12345', Insert a unique invoice number
                    // payment_options: {
                    //     allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
                    // },
                    // soft_descriptor: 'ECHI5786786',
                    item_list: {
                        items: temporary_items,
                        shipping_address: user
                    }
                }],
                note_to_payer: 'Contact us for any questions on your order.'
            };
            var button = {
                // Configure environment
                env: 'sandbox',
                client: {
                    sandbox: 'Aa2bNfSzzsvCcL-8dWh5hbNMYjkpLxBonkoPQEmTaOifRMucFBeEZIw057fgdVwLDJwHPvkaGpM21JUt',
                    production: 'demo_production_client_id'
                },
                // Customize button (optional)
                locale: 'en_US',
                style: {
                    size: 'small',
                    color: 'gold',
                    shape: 'pill',
                },
            
                // Enable Pay Now checkout flow (optional)
                commit: true,
            
                // Set up a payment
                // Set up a payment
                payment: function(data, actions) {
                    return actions.payment.create(transaction);
                },
                // Execute the payment
                onAuthorize: function(data, actions) {
                    return actions.payment.execute().then(function() {
                        // Show a confirmation message to the buyer
                        window.alert('Thank you for your purchase!');
                    });
                }
            };
                
            paypal.Button.render(button,'#paypal-button');   
        
            };
        }
    });

window.onload = function (){
    new Shop("#Whole_Site");
}












