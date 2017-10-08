var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "dee139139",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected.");
});


var q = 'SELECT item_id, product_name, price FROM products';
connection.query(q, function (err, res, fields) {
    console.log(err);
    
    for (var i = 0; i < res.length; i++) {
    console.log(
            "Item No: " +
                res[i].item_id +
                " || Product: " +
                res[i].product_name +
                " || Price: $" +
                res[i].price
    );
    }
    buyItemNo();
});


var item = 0;
var qty = 0;

function buyItemNo() {
    inquirer
        .prompt({
            name: "item",
            type: "input",
            message: "Please enter Item No. to purchase."
        })
        .then(function (answer) {
            item = answer;
            console.log(answer.item);
            //var q = 'SELECT item_id, product_name, price FROM products';
            //connection.query(q, function (err, res) {
            //    console.log(err);
            //    console.log(res);
              
                buyQty();
            //});
        });
}

function buyQty() {
    inquirer
        .prompt({
            name: "qty",
            type: "input",
            message: "Please enter quantity of item."
        })
        .then(function (answer) {
            qty = answer;
            console.log(qty);
            checkInv();
        });
}

function checkInv() {
    connection.query("SELECT stock_quantity FROM products WHERE item_id = 2", function (err, res) {
        console.log(res);
    });
}




connection.end();