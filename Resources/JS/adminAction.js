$(document).ready(function () {
    let params = new URLSearchParams(location.search);
    var container = $('.display_container').get(0);
    var products_container = $('.products_container').get(0);
    $(products_container).css('display', 'none');
    var contents = `<h1 class="admin_title">${params.get('action')} Product</h1>`;
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
    //Get File and put in textbox
    let file = {};
    let fileSelected = false;

    //Add Functionality Helper functions
    function makeAddScene() {
        contents += ` 
        <div class="main_container">
            <div class="sm_container name_container">
                <label for="name">Name</label>
                <input type="text" name="" id="name" class="input name">
            </div>
            <div class=" sm_container price_container">
                <label for="price">Price</label>
                <input type="text" name="" id="price" class="input price">
            </div>
            <div class=" sm_container desc_container">
                <label for="desc">Description</label>
                <textarea class="input desc" id="desc" type="textarea"></textarea>
            </div>
            <div class=" sm_container medium_container">
                <label>Medium</label>
                <select name="medium_picker" id="medium_picker" class="input medium" type="select">
                    <option value="none">Please Select a medium value</option>
                    <option value="Oil">Oil</option>
                    <option value="Water Colour">Water Colour</option>
                    <option value="Acrylic">Acrylic</option>
                    <option value="Coffee">Coffee</option>
                </select>
            </div>
            <div class="sm_container size_container">
                <label>Size</label>
                <select name="size_picker" id="size_picker" class="input size" type="select">
                    <option value="none">Please Select a size value</option>
                    <option value="A5">A5</option>
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Commision">Commission</option>
                </select>
            </div>
            <div class="sm_container image_upload_container">
                <input id="upload_file" type="file" accept=".jpg , .png, .svg"/>
                <a href="#">Image Upload</a>
                <div class="image_file_name_container">Please Upload A File Here</div>
            </div>
            <div class="sm_container button_submit_container">
                <a href="#">Submit</a>
            </div>
        </div>`;
        container.insertAdjacentHTML('afterbegin', contents);
        insertProductImage();
        addProduct();
        console.log('Add has been picked');
    }
    //Get and Validate Form
    function gatherInputs(form){
        var children = Array.from($(form).children());
        children = children
            .map(child => $(child).find('.input'))
            .filter(child => child.length !== 0)
            .map(child => $(child).get(0));
        var formInputs = children;
        var isValid = validateInputs(formInputs);
        return isValid;
    }
    function validateInputs(formInputs){
        var requiredFields = {
            empty: "",
            standard_length: 10,
            description_length: 20,
            price_regex: /^\d+(,\d{3})*(\.\d{1,2})?$/
        }
        const nameInputs = formInputs
            .filter(formInput => $(formInput).attr('id') === "name")
            .map(formInput =>
                $(formInput).val() !== requiredFields.empty
                && $(formInput).val().length >= requiredFields.standard_length
            );
        const priceInput = formInputs
            .filter(formInput => $(formInput).attr('id') === 'price')
            .map(formInput =>
                requiredFields.price_regex.test($(formInput).val())
            );
        const textAreaInputs = formInputs
            .filter(formInput => $(formInput).attr('type') == "textarea")
            .map(formInput =>
                $(formInput).val() !== requiredFields.empty
                && $(formInput).val().length >= requiredFields.description_length
            );
        const selectInputs = formInputs
            .filter(formInput => $(formInput).attr('type') === "select")
            .map(formInput =>
                formInput.options.selectedIndex !== 0
            );
        // console.log(nameInputs , priceInput ,  textAreaInputs , selectInputs);
        var validatedInputs = [...nameInputs, ...priceInput, ...textAreaInputs, ...selectInputs];
        // console.log(validatedInputs);
        if (validatedInputs.includes(false))
            return false;
        else
            return true;
    }
    function insertProductImage() {
        $('.image_upload_container a').click(function (e) {
            e.preventDefault();
            $("#upload_file").trigger('click');
            $("#upload_file").change(function (e) {
                var image_name = e.target.files[0].name;
                file = e.target.files[0];
                fileSelected = true;
                $('.image_file_name_container').html(image_name);
            });
        });
    }
    function addProduct() {
        $('.button_submit_container a').click(function (e) {
            var form = $('.main_container').get(0);
            var isValid = gatherInputs(form);
            console.log(isValid);
            console.log(fileSelected);
            if (!isValid || !fileSelected)
                e.preventDefault();
            var firebaseStorage = firebase.storage().ref('products/' + file.name);
            var databaseStorage = firebase.database().ref().child('products');
            if(isValid && fileSelected)
                firebaseStorage.put(file).then(function(result){
                    firebaseStorage.getDownloadURL().then(function (url) {
                        var product = {
                            name: $('.name').val(),
                            price: $('.price').val(),
                            description: $('.desc').val(),
                            medium: $('.medium').get(0).value,
                            size: $('.size').get(0).value,
                            image_url: url
                        };
                        databaseStorage.push(product);
                        window.location.href = "../../Resources/HTML/AdminAction.html?action=Add";
                    }).catch(function (error) {
                        console.log(error);
                    });
                });
            
            
        });
    }

    //View Functionality Helper Functions
    function getProducts(){
        var databaseStorage = firebase.database().ref().child('products');
        databaseStorage.on('child_added', snap => {
            makeViewScene(snap.val());
        });
    }
    function makeViewScene(value){
        console.log(value);
        $(products_container).css('display', 'flex');
        contents = ` 
        <div class="product_container">
            <div class="product_container_sm">
                <img src="${value.image_url}">
            </div>
            <h3>${value.name}</h3>
        </div>
        `;
        products_container.insertAdjacentHTML('afterbegin', contents);
        console.log('View has been picked');
    }



    switch (params.get('action')) {
        case 'Add':
            makeAddScene();
            break;
        case 'View':
            getProducts();
            break;
        case 'Update':
            makeUpdateScene();
            break;
        case 'Delete':
            makeDeleteScene();
            break;
        default:
            break;
    }
})