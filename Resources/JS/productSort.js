let params = new URLSearchParams(location.search);
let art_product = makeObject();
function makeObject() {
    let art_product = {
        Image_Link: params.get('image'),
        Name: params.get('name'),
        Price: params.get('price'),
        Description: params.get('description'),
    };
    return art_product;
}


var d1 = document.getElementById('Product_Container');
d1.setAttribute("data-image" , art_product.Image_Link);
d1.setAttribute("data-price" , art_product.Price);
d1.setAttribute("data-name" , art_product.Name);
d1.insertAdjacentHTML('afterbegin', `
    <div class="Image_Container">
        <img src="${art_product.Image_Link}">
    </div>
`);

var details = document.getElementById("detailsContainer");
details.insertAdjacentHTML('afterbegin', `
    <div class="first_Details_Container">
        <h2>${art_product.Name}</h2>
        <h2>€${art_product.Price}</h2>
    </div>
    <div class="second_Details_Container">
        <p>${art_product.Description}Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam alias, aperiam inventore sequi aut voluptates quisquam? Dignissimos ex ea excepturi quis animi tenetur aspernatur, rem unde consequatur earum maiores consequuntur!
        Eligendi incidunt aspernatur, enim odio earum, quas alias doloribus deserunt voluptatem consectetur illum modi aliquid omnis ratione impedit quis recusandae repellendus temporibus! Qui similique, nemo itaque odit earum blanditiis dolore.
        Accusantium obcaecati, dicta repellat facilis aliquam provident laborum impedit, culpa dolorum veniam, ducimus earum in corporis? Animi minima quidem aspernatur, iure repudiandae, nihil eum minus exercitationem corrupti perspiciatis, deserunt nam?
        </p>
    </div>
    <span class="buttons">
        <a href="../../Resources/HTML/Shop.html" class="btn-product-view">Back To Browse</a>
        <form action="../../Resources/HTML/Cart.html" method="post" class="add-to-cart">
            <input type="hidden" name="qty-1" id="qty-1" class="qty" value="1">
            <input type="submit" class="btn-product-view cart" value="Add To Cart">
        </form>
        <a href="../../Resources/HTML/Cart.html" class="btn-product-view">Add To Cart</a>
    </span>
`);









