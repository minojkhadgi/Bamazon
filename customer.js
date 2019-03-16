let mysql = require("mysql");
let inquirer = require("inquirer");
let table = require("cli-table");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as ID " + connection.threadId);
})

let displayInventory = function () {
    var query = "Select * FROM products"; {
        connection.query(query, function(err, res){
            if(err) throw err;
            var dTable = new table({
                head: ["ID", "Product Name", "Catagory", "Price", "Quantity"],
                colWidths: [10, 25, 25, 14, 10]
            });
            for(var i = 0; i<res.length; i++){
            dTable.push(
                [res[i].ID, res[i].Product_name,res[i]. Department,res[i].Price,res[i].Stock]
            );
        }
        console.log(dTable.toString());
        buyPrompt();
    });
}
function buyPrompt(){
    inquirer.prompt([
{

    name:"ID",
    type:"input",
    message:"Which ID would you like to buy?",
    filter:Number,
    validate: validateInput,
},
{
    name:"Quantity",
    type:"input",
    message:"How many?",
    filter:Number
},
]).then(function(answers){
    var quantity =answers.Quantity;
    var IDrequested = answers.ID;
    purchaseOrder(IDrequested,quantity);
});
};
function purchaseOrder(ID, amtNeeded){
    connection.query("select * FROM products WHERE ID = " + ID, function(err,res){
        if (err){
            console.log(err)
        };
        if(amtNeeded<=res[0].Stock){
            var total = res[0].Price*amtNeeded;
            console.log("We have enough stock for your order!!");
            console.log("Your total for " + amtNeeded + " " + res[0].Product_name + " is " + total + " Thank YOU ... Visit Again!!")
            connection.query("UPDATE products SET Stock = Stock - " + amtNeeded + " WHERE ID = " + ID);

        }else{
            console.log("Sorry we do not have enough " + res[0].Product_name +  " for your order.")
            console.log("Sorry we do not have that item  " + res[0].ID +  " for your order.")
        };
        //displayInventory();
    } );
}
};
displayInventory();
