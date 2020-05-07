//Variable Declarations
var art_items = [];
var art_item = {};
var products_container = "";
var page = window.location.href;

 // Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBvlJUyDmBHNfEjwkZ_Auf8Jr1mbXDdP7k",
    authDomain: "artbyanc-70f23.firebaseapp.com",
    databaseURL: "https://artbyanc-70f23.firebaseio.com",
    projectId: "artbyanc-70f23",
    storageBucket: "artbyanc-70f23.appspot.com",
    messagingSenderId: "687386013503",
    appId: "1:687386013503:web:b7e75afa311b99fae06d8a",
    measurementId: "G-PD1GXNZL2G"
};
firebase.initializeApp(firebaseConfig);


//Function Definitions
function getProducts(){
    var databaseStorage = firebase.database().ref().child('products');
    var Commissioned_Products = [];
    databaseStorage.on('child_added', snap => {
        if(page.includes("Shop"))
            displayProducts(snap.val());
        else if( page.includes("Commission"))
            console.log(page);
            if(snap.val().size !== "Commission")
                return;
            Commissioned_Products.push(snap.val());
            fillCommissionSection(Commissioned_Products);
    });
}

function displayProducts(value){
    var contents = `
    <div class="Product_Details" data-medium= "${value.medium}" data-size ="${value.size}">
        <img src="${value.image_url}">
        <div class="Product_sm_bar">
            <div onclick="viewImage(this, this.parentNode.parentNode)">
                <i class="fa fa-2x fa-eye" aria-hidden="true"></i>
            </div>
            <a href="../../Resources/HTML/ProductView.html?image=${value.image_url}&name=${value.name}&price=${value.price}&description=${value.description}">VIEW PRODUCT</a>
        </div>
        <div class="Product_Actual_Details">
            <h2>${value.description}</h2>
            <h3>€${value.price}</h3>
        </div>
    </div>`;
    if(document.getElementsByClassName('filter_mobile')[0] && document.getElementsByClassName('pointer')[0]){
        displayFilterAndSort();
    }
    products_container = $(".Products_Container").get(0);
    console.log(products_container);
    products_container.insertAdjacentHTML('afterbegin', contents);
}





function displayPricePicker(){
    var price_picker = "";
    if (document.getElementById('Price_Picker')){
        price_picker = document.getElementById('Price_Picker');
        const price_range_filter = new JSR([price_picker],{
            sliders:1,
            values: [25],
            min: 30, 
            max: 150,
            labels: {
                formatter: function (value){
                    return '€' + value.toString()
                }
            },
            limit: {
                show: true
            },
            grid: false
        });
        var canvas = document.getElementsByClassName('jsr_canvas')[0];
        canvas.style.width = "275px";
        price_range_filter.addEventListener('update', (input, value) => {
            //console.log(input, value);
            filterProductsBy(value , "");
        });
    } 
}

function displayFilterAndSort(){
    var filter = document.getElementsByClassName('filter_mobile')[0];
    var filter_container = document.getElementsByClassName('Filter_Container')[0];
    var sorter = document.getElementsByClassName('pointer')[0];
    var sort_container = document.getElementsByClassName('sort_options_container')[0];
    filter.onclick = function(){
        //This just checks if the other is open before allowing them open
        if (sort_container.classList.contains('open') == false){
            filter_container.classList.toggle('open');
            console.log("filter_open");
        } else {
            console.log("sorter is open , filter can't open");
            filter_container.classList.toggle('close'); 
        }
    }
    
    sorter.onclick = function(){
        //This just checks if the other is open before allowing them open
        if (filter_container.classList.contains('open') == false){
            sort_container.classList.toggle('open');
        } else {
            console.log("filter is open , sort can't open");
            sort_container.classList.toggle('close'); 
        }
    }
}




function viewImage(image, product){
    var image_src = image.parentNode.previousSibling.previousSibling.src;
    if (document.getElementsByClassName("Products_Container")[0]){
        var products_container = document.getElementsByClassName("Products_Container")[0];
        products_container.insertAdjacentHTML('afterbegin',`
            <div class="Quick_View_Container">
                <img src="${image_src}">
                <div class="Dismiss_btn" onclick="dismissImage()">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </div>
            </div>
        `);
    }
    if(document.getElementsByClassName("Quick_View_Container")[0]){
        // var product_top = document.getElementsByClassName("Product_Details");
        product_top = product.offsetTop;
        console.log(product_top);
        var quick_view_container = document.getElementsByClassName("Quick_View_Container")[0];
        quick_view_container.style.top = product_top + "px";
        // var product = image.parentNode.previousSibling.previousSibling.parentNode;
        // var product_rect =  product.getBoundingClientRect().top;
        // console.log(product_rect);
        // var products_container_rect = document.getElementsByClassName("Products_Container")[0].getBoundingClientRect().top;
        // console.log(products_container_rect);
        // offset   = product_rect - products_container_rect;
        // console.log('Element is ' + offset + ' vertical pixels from <div class="Products_Container"></div>');
        // var quick_view_container = document.getElementsByClassName("Quick_View_Container")[0];
        // quick_view_container.style.top = offset / 5.8 + "vh";
        // console.log(quick_view_container.style.top);
        
    }
}

function dismissImage(){
    if(document.getElementsByClassName("Quick_View_Container") [0]){
        var quick_view_container = document.getElementsByClassName("Quick_View_Container") [0];
        quick_view_container.style.display = "none";
    }
}

function _convertString(numStr){
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
}

function filterProductsBy(price , otherFilters){
    var products = Array.from(getProductContainers());

    //This is the filter working for the price
    var price_picker_value = price;
    // var price_picker_max_value = price_picker_value + 10;
    var price_picker_min_value = price_picker_value - 10;

    var elements_price_value = document.getElementsByTagName('h3');
    $(elements_price_value).each(function(price){
        var element = $(elements_price_value).get(price);
        var element_price_value_str = $($(elements_price_value).get(price)).text();
        element_price_value_str = element_price_value_str.replace("€" , "");
        var productContainer = $($(element).parent().parent()).get(0);
        var element_price_value_number = _convertString(element_price_value_str);
        if (!(element_price_value_number >= price_picker_min_value)){
            $(productContainer).addClass('not_applicable');           
        } else {
            $(productContainer).removeClass('not_applicable');  
        }
    });

    //This is the filter working for the checkboxes 
    products
    .filter(function (product){
        if(!(otherFilters.includes($(product).data('medium')) || otherFilters.includes($(product).data('size'))))
        return otherFilters;
        else 
        $(product).removeClass('does_not_apply')
    })
    .map(product => $(product).addClass('does_not_apply'));
    console.log(otherFilters);
    // return otherFilters;
}



function getProductContainers(){
    var product_containers = document.getElementsByClassName('Product_Details');
    return product_containers
}


function checkFilters(){
    var filtersChecked = [];
    var checkboxes  = Array.from($('.filter'));
    checkboxes = checkboxes
    .filter(checkbox => checkbox.checked == true)
    .map(function(checkbox){
        if ($(checkbox).data('medium'))
        filtersChecked.push($(checkbox).data('medium'));
        else if ($(checkbox).data('size'))
        filtersChecked.push($(checkbox).data('size'));
    });
    //console.log(checkboxes , filtersChecked );
    var allProduct_Containers = Array.from(getProductContainers());
    //console.log(allProduct_Containers);
    //console.log(filtersChecked);
    if(filtersChecked.length == 0){
        allProduct_Containers.map(product => $(product).removeClass('does_not_apply'));
    } else {
        filterProductsBy(0.00, filtersChecked);
    }
    return filtersChecked;
}


function fillCommissionSection(Commission_Products){
    var container = $('.Commissioned_Work_Pieces').get(0);
    Commission_Products = Commission_Products.map(product => `
    <div class="Commission_Image_Container">
        <div class = "Commission_Image_Container_sm">
            <img src="${product.image_url}"
        </div>
        <h3>${product.name}</h3>
    </div>`);
    // console.log(Commission_Products , Commission_Products.length);
    if (Commission_Products.length < 5)
        return;
    container.insertAdjacentHTML('afterbegin' , Commission_Products);

}


var clickListener = function(event){
    console.log(event.target);
    var filtersChecked = checkFilters();
    if(event.target.checked){
        filterProductsBy(0.00, filtersChecked);
    } else {
        checkFilters();
    }
};

var fireFilterEventListeners = function(){
    var filters = Array.from($('.filter'));
    filters.map(filter =>  $(filter).on('click' , clickListener));
}


//Method Calls
getProducts();
fireFilterEventListeners();
displayPricePicker();


