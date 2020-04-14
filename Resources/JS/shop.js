var art_items = getPictures();
// console.log(art_items[53]);
displayPricePicker();
if(document.getElementsByClassName('filter_mobile')[0] && document.getElementsByClassName('pointer')[0]){
    displayFilterAndSort();
}

function getPictures(){
    let art_items = []
    $.get("https://sheets.googleapis.com/v4/spreadsheets/1NzRo_PwoUBnDO-LM8mpoPP__YHOj7CtMhMYKH-JVAw8/values/Sheet1?key=AIzaSyBU-vvNHDfvd27NWOGjGEXBgg_wqO6Vu-s", function(response, status){
        // console.log(response.values);
        let data = response.values;
        for (let index = 0; index < data.length; index++) {
            const product = data[index];
            let art_item = {
                Name: product[0],
                Collection: product[1],
                Price: product[2],
                Stock: product[3],
                Description: product[4],
                Image_Link: product[5],
                Url: encodeURIComponent(product[5])
            }
            art_items.push(art_item);   
        }
        for(let i = 0; i < art_items.length; i++){
            if(i == 0){
                delete art_items[i];
            } else if(i % 11 == 0){
                delete art_items[i];
            }
        }
        // if (document.getElementsByClassName("colour_of_month_collage")[0]){
        //     var color_of_month_collage = document.getElementsByClassName("colour_of_month_collage")[0];
        //     art_items.slice(0,5).forEach(function(art_item){
        //         if (art_item.Image_Link){
        //             color_of_month_collage.insertAdjacentHTML('afterbegin',`
        //                 <img src="${art_item.Image_Link}">
        //             `);
        //         }
        //     });
        // }
        if (document.getElementsByClassName("Products_Container")[0]){
            var products_container = document.getElementsByClassName("Products_Container")[0];
            art_items.forEach(function(art_item){
                if (art_item.Image_Link){
                    products_container.insertAdjacentHTML('afterbegin',`
                        <div class="Product_Details">
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
        new JSR([price_picker],{
            sliders:1,
            values: [25],
            min: 20, 
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

