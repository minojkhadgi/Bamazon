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
    filter:Number
},
{
    name:"Quantity",
    type:"input",
    message:"How many?",
    filter:Number
},
]).then(function(answers){
    var quantity =answer.Quantity;
    var IDrequested = answers.ID;
});
};
};
displayInventory();