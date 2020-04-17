function ColourSorter(){
    const self = {
        colours:['Red', 'Green' , 'Blue'],
        getColourGroup:(hexCode) => {
            var rgb_number = 0.00;
            hexCode = hexCode.replace("#" , "");
            var hexCodeArray = hexCode.split("");
            $(hexCodeArray).each(function(hexCode){
                var hexCode_value = $(hexCodeArray).get(hexCode);
                console.log(hexCode_value);
                switch(hexCode_value){
                    case "0":
                        rgb_number = 0.00;
                        break;
                    case "1":
                        rgb_number = 1.00;
                        break;
                    case "2":
                        console.log(hexCode_value);
                        rgb_number = 2.00;
                        break;
                    case "3":
                        rgb_number = 3.00;
                        break;
                    case "4":
                        console.log(hexCode_value);
                        rgb_number = 4.00;
                        break;
                    case "5":
                        console.log(hexCode_value);
                        rgb_number = 5.00;
                        break;
                    case "6":
                        rgb_number = 6.00;
                        break;
                    case "7":
                        rgb_number = 7.00;
                        break;
                    case "8":
                        rgb_number = 8.00;
                        break;
                    case "9":
                        rgb_number = 9.00;
                        break;
                    case "A":
                        console.log(hexCode_value);
                        rgb_number = 10.00;
                        break;
                    case "B":
                        rgb_number = 11.00;
                        break;
                    case "C":
                        rgb_number = 12.00;
                        break;
                    case "D":
                        console.log(hexCode_value);
                        rgb_number = 13.00;
                        break;
                    case "E":
                        console.log(hexCode_value);
                        rgb_number = 14.00;
                        break;
                    case "F":
                        rgb_number = 15.00;
                        break;
                    default:
                        break;
                }
                if (!(hexCode  == "0" || hexCode == "2" || hexCode == "4")){
                    console.log(rgb_number);
                    console.log(hexCode_value);
                    rgb_number += rgb_number;
                } else {
                    console.log(rgb_number);
                    console.log(hexCode_value);
                    rgb_number += rgb_number * 16;
                } 
            });

            return rgb_number;
        }
    }
    return self
}

//console.log(ColourSorter().colours);
console.log(ColourSorter().getColourGroup('#4EA5D2'));