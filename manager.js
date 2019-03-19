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
});
let displayInventory = function () {
    var query = "Select * FROM products"; {
        connection.query(query, function (err, res) {
            if (err) throw err;
            var dTable = new table({
                head: ["ID", "Product Name", "Catagory", "Price", "Quantity"],
                colWidths: [10, 25, 25, 14, 10]
            });
            for (var i = 0; i < res.length; i++) {
                dTable.push(
                    [res[i].ID, res[i].Product_name, res[i].Department, res[i].Price, res[i].Stock]
                );
            }
            console.log(dTable.toString());
            updates();
        });
    };
    function updates() {
        inquirer.prompt([{
            name: "action",
            type: "list",
            message: "choose an option to manage your inventory.",
            choices: ["Add New Product", "Restock Product", "Remove Existing Product"]

        }]).then(function (answers) {
            switch (answers.action) {
                case "Restock Product":
                    restockProduct();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
                case "Remove Existing Product":
                    removeExisting();
                    break;
            }
        });

    };

    function restockProduct() {
        inquirer.prompt([{
            name: "id",
            type: "inputID",
            message: "which ID would you like to restock?"
        },
        {
            name: "Quantity",
            type: "inputN",
            message: "What quantity would you like to add?"
        },
    ]).then(function(addInventory){
        connection.query("UPDATE products SET? WHERE ?",[{
            Stock:addInventory.inputN
        },{

            ID:addInventory.inputID
        }],
        function(err,res){

        });
        displayInventory();
    });
}
    //     ]).then(function (answers) {
    //         var addedQuantity = answers.Quantity;
    //         var productID = answers.ID;
    //         restockInventory(addedQuantity, productID);
    //     });
    // }
    // function restockInventory(id,Quantity){
    //     connection.query("SELECT *FROM Products WHERE ID = " +id, function(err,res){
    //         if (err){console.log(err)};
    //         connection.query("UPDATE Products SET Stock = Stock + " + Stock + "WHERE ID = " +ID);
    //         displayInventory();
    //     });

    // };
function addProduct(){
    inquirer.prompt([{
        name:"ID",
        type:"input",
        message:"which ID?"
    },
    {
        name:"Product_name",
        type:"input",
        message:"Name of Product?"
    },
    {
        name:"Department",
        type:"input",
        message:"What Department?"
    },
    {
        name:"Price",
        type:"input",
        message:"How much Price?"
    },
    {
        name:"Stock",
        type:"input",
        message:"What quantity would you like to add?"
    },
]).then(function(answers){
var id =answers.ID;
var productName = answers.Product_name;
var department = answers.Department;
var price = answers.Price;
var stock = answers.Stock;
newItem (id,productName,department,price,stock);
});
};
function newItem(id,productName,department,price,stock){
    connection.query('INSERT INTO products(ID, Product_name,Department,Price,Stock) VALUES("' + id + '","' + productName + '","' + department + '",' + price + ',' + stock +  ')');
    displayInventory();
};
function removeExisting(){
    inquirer.prompt([
    {
        name:"ID",
        type:"input",
        message:"which item would you like to remove from the list?"
    }
 ]).then (function(answers){
     var id = answers.ID;
     removeItem(id);
 });
};
function removeItem(id){
    connection.query('DELETE FROM Products WHERE ID = ' + id);
    displayInventory();
};
};

displayInventory();