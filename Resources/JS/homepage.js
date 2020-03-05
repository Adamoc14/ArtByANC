function getColourPictures(){
    $.get("https://sheets.googleapis.com/v4/spreadsheets/1NzRo_PwoUBnDO-LM8mpoPP__YHOj7CtMhMYKH-JVAw8/values/Sheet1?key=AIzaSyBU-vvNHDfvd27NWOGjGEXBgg_wqO6Vu-s", function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
}

getColourPictures();