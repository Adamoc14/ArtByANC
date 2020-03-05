getColourPictures();
function getColourPictures(){
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
        if (document.getElementsByClassName("colour_of_month_collage")[0]){
            var color_of_month_collage = document.getElementsByClassName("colour_of_month_collage")[0];
            art_items.slice(0,10).forEach(function(art_item){
                if (art_item.Image_Link){
                    color_of_month_collage.insertAdjacentHTML('afterbegin',`
                        <img src="${art_item.Image_Link}">
                    `);
                }
            });
        }
        // console.log(art_items);  
    });
    return art_items;
}

