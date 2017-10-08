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


var item;
var qty;
var product;
var pricing;
var inv;

function buyItemNo() {
    inquirer
        .prompt({
            name: "item",
            type: "input",
            message: "Please enter Item No. to purchase."
        })
        .then(function (answer) {
            item = answer.item; 
            console.log(answer.item);
            var q = 'SELECT item_id, product_name, price FROM products where item_id = ?';
            connection.query(q, (answer.item),function (err, res) {
                console.log(err);
                console.log(`You chose ${res[0].product_name} for $${res[0].price} each.`);

                product = res[0].product_name;
                pricing = res[0].price
              
                buyQty();
            });
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
            qty = answer.qty;
            console.log(answer.qty);
            checkInv();
        });
} 

function checkInv() {
    var q = 'SELECT stock_quantity FROM products where item_id = ?';
    connection.query(q, item, function (err, res) {
        console.log(err);
        console.log(`There are ${res[0].stock_quantity} in stock.`);
      
        if (res[0].stock_quantity >= qty) {
            checkout();
        } else {
            console.log('Insufficient quantity! (Enter new qty.)');
            buy4Qty();
        }

    });
}

function checkout() {
    var q = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?';
    connection.query(q, [qty, item], function (err, res) {
        console.log(err);
        var total = pricing * qty;
        console.log(`You had purchased QTY ${qty} of ${product} for $${total}.`);
    });

    var q = 'SELECT stock_quantity FROM products where item_id = ?';
    connection.query(q, item, function (err, res) {
        console.log(err);
        console.log(`There are ${res[0].stock_quantity} of ${product} remaining in stock.`);

    });
}

//function invCount() {
//    var q = 'SELECT stock_quantity FROM products where item_id = ?';
//    connection.query(q, item, function (err, res) {
//        console.log(err);
//        return inv = res[0].stock_quantity;
//        console.log(inv);
//    });
//}


