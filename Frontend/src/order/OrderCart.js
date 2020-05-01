const templates = require("../Templates");
const storage = require("../storage");

var $cart = $("#ct-container");
var $items_count = $("#ct-count");
var $total_price = $("#ct-summ");

var Cart;

function initializeCart() {
	Cart = storage.get("cart");
	updateCart();
	$("#edit").click(function() {
        window.location.href = "/";
    });
}

function updateCart() {
	$cart.html("");

    var totalPrice = 0;
    Cart.forEach(function(item) {
        totalPrice += item.quantity * item.pizza[item.size.field].price;
        var htmlCode = templates.OrderCart_OneItem(item);
        var $node = $(htmlCode);
        $cart.append($node);
    });

    $total_price.text(totalPrice);
    $items_count.text(Cart.length);
}

function getPizzaInCart() {
    return Cart;
}

function clearCart() {
	CART = [];
	updateCart();
    storage.set("cart", CART);
}

exports.initializeCart = initializeCart;
exports.getPizzaInCart = getPizzaInCart;
exports.clearCart = clearCart;
