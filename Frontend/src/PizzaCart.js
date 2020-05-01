var templates = require("./Templates");
var storage = require("./storage");

var CART = [];

var PizzaSize = {
    Small: { field: "smallSize", string: "Мала" }, // Для удобного доступа к полю размера и превращения его в текст "Велика", "Мала"
    Big: { field: "bigSize", string: "Велика" }
};

var $total_price = $("#ct-summ");
var $cart = $("#ct-container"); // Тут хранится js-объект, который соответствует html-элементу с id ct-container
var $items_count = $("#ct-count");

function initializeCart() {
	var cart = storage.get("cart"); // Забираем с local storage массив пицц, которые были до этого
    if (cart) CART = cart;
    $("#order-btn").click(function() {
        window.location.href = "/order.html";
	});
	
	$("#ct-clear").click(function() {
		clearCart();
	});

    updateCart();
}

function addToCart(pizza, size) {
    var pizzaInCart;
    for (var i = 0; i < CART.length; i++)
        if (CART[i].pizza.title === pizza.title && CART[i].size.field === size.field) {
            pizzaInCart = CART[i];
            break;
        }

    if (pizzaInCart) pizzaInCart.quantity++;
    else
        CART.push({
            pizza: pizza,
            size: size,
            quantity: 1
		});
		
    updateCart();
}

function clearCart() {
    CART = [];
    updateCart();
}

function removeFromCart(item) {
    CART.splice(CART.indexOf(item), 1); // Отвечает за удаление в массиве
    updateCart();
}

function updateCart() {
    storage.set("cart", CART); // Перезаписываем корзину в local storage той, что у нас есть сейчас

    $cart.html("");
    $items_count.text(CART.length); // Обновляем количество пицц

    function showOnePizzaInCart(item) {
        var htmlCode = templates.PizzaCart_OneItem(item); // Превращаем ejs в html
        var $node = $(htmlCode);

        $node.find(".inc-button").click(function() {
            item.quantity++;
            updateCart();
        });

        $node.find(".dec-button").click(function() {
            item.quantity--;
            if (item.quantity < 1) removeFromCart(item);
            updateCart();
        });

        $node.find(".rem-button").click(function() {
            removeFromCart(item);
        });

        $cart.append($node);
    }

    function updateTotalPrice() {
        var total = 0;

        CART.forEach(function(item) {
            total += item.quantity * item.pizza[item.size.field].price;
        });

        $total_price.text(total);
    }

    CART.forEach(showOnePizzaInCart); // Пробегает по всему массиву пиц и вызывает для каждой функцию showOnePizzaInCart
    updateTotalPrice();
}

exports.addToCart = addToCart;
exports.initializeCart = initializeCart;
exports.PizzaSize = PizzaSize;
