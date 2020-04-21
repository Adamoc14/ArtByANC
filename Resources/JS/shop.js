var art_items = getPictures();
displayPricePicker();
if(document.getElementsByClassName('filter_mobile')[0] && document.getElementsByClassName('pointer')[0]){
    displayFilterAndSort();
}


function getPictures(){
    let art_items = []
    var isEmpty = false;
    $.get("https://sheets.googleapis.com/v4/spreadsheets/1NzRo_PwoUBnDO-LM8mpoPP__YHOj7CtMhMYKH-JVAw8/values/Sheet1?key=AIzaSyBU-vvNHDfvd27NWOGjGEXBgg_wqO6Vu-s", function(response, status){
        let data = response.values;
        let art_item = {};
        for (let index = 0; index < data.length; index++) {
            const product = data[index];
            // console.log(product);
            if (!(product[1] == "Price")){
                art_item = {
                    Name: product[0],
                    Price: product[1],
                    Description: product[2],
                    Medium: product[3],
                    Size : product[4],
                    Image_Link: product[5],
                    Url: encodeURIComponent(product[5]),
                    Stock: product[6],
                }
            }
            if(Object.keys(art_item).length == 0){
                isEmpty = true;
            } else {
                art_items.push(art_item);  
            }
             
        }

        // console.log(art_items);

        if (document.getElementsByClassName("Products_Container")[0]){
            var products_container = document.getElementsByClassName("Products_Container")[0];
            art_items.forEach(function(art_item){
                if (art_item.Image_Link){
                    products_container.insertAdjacentHTML('afterbegin',`
                        <div class="Product_Details" data-medium= "${art_item.Medium}" data-size ="${art_item.Size}">
                            <img src="${art_item.Image_Link}">
                            <div class="Product_sm_bar">
                                <div onclick="viewImage(this, this.parentNode.parentNode)">
                                    <i class="fa fa-2x fa-eye" aria-hidden="true"></i>
                                </div>
                                <a href="../../Resources/HTML/ProductView.html?image=${art_item.Url}&name=${art_item.Name}&price=${art_item.Price}&description=${art_item.Description}">VIEW PRODUCT</a>
                            </div>
                            <div class="Product_Actual_Details">
                                <h2>${art_item.Description}</h2>
                                <h3>€${art_item.Price}</h3>
                            </div>
                        </div>
                    `);
                    // console.log(art_item.Image_Link);
                }
            });
        }
        // console.log(art_items);  
    });
    return art_items;
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
    console.log(checkboxes , filtersChecked );
    var allProduct_Containers = Array.from(getProductContainers());
    console.log(allProduct_Containers);
    console.log(filtersChecked);
    if(filtersChecked.length == 0){
        allProduct_Containers.map(product => $(product).removeClass('does_not_apply'));
    } else {
        filterProductsBy(0.00, filtersChecked);
    }
    return filtersChecked;
    // var mediums_checked = [];
    //console.log(medium_containers);
    // $(medium_containers).each(function(container){
    //     var medium_filters = $(medium_containers).get(container);
    //     //console.log(medium_filters);
    //     $(medium_filters).on('click' , function(e){
    //         if($(medium_filters).is(":checked")){
    //             mediums_checked.push(e.target);
    //             console.log("A checkbox has been checked" + " " + e.target.id);
    //         } else {
    //             console.log("A checkbox has been unchecked" + " " + $(this).attr('id'));
    //             var id_unchecked = $(this).attr('id');
    //             for(var i = 0; i < mediums_checked.length ; i++){
    //                 if(mediums_checked[i].id == id_unchecked){
    //                     mediums_checked.splice(i , 1);
    //                 }
    //             }
    //         }
    //         //console.log(mediums_checked);
    //         filterProductsBy(0.00 , mediums_checked , "");
    //     })
    // });
    // console.log(medium_containers);
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
fireFilterEventListeners();
