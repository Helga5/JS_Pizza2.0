var crypto = require("crypto"); // Библиотека

var liqpay_private = "sandbox_xT0EvpCZYYVG680KxzJmpHSI9UlwVMbrR9mgOPLQ";
var liqpay_public = "sandbox_i22765506012";

function createOrder(order) {
	var price = calculatePrice(order.cart);
	var result = {
		version: 3,
		public_key: liqpay_public,
		action: "pay",
		amount: price,
		currency: "UAH",
		description: createDescription(order.name, order.phone, order.address, order.cart, price),
		order_id: Math.random(),
		sandbox: 1,
	};

	var base64 = new Buffer(JSON.stringify(result)).toString("base64"); // Превращает текст в base64
	var string = JSON.stringify({
		data: base64,
		signature: sha1(liqpay_private + base64 + liqpay_private), // Служебная информация для приватбанка. Подтверджение подлинности нас
	});
	return string;
}

function sha1(string) { // Алгоритм хешування
	var sha1 = crypto.createHash("sha1");
	sha1.update(string);
	return sha1.digest("base64");
}

function calculatePrice(cart) {
	var result = 0;
	cart.forEach(function (item) {
		result += item.quantity * item.pizza[item.size.field].price;
	});
	return result;
}

function createDescription(name, phone, address, cart, price) {
	var result = "Замовлення піци: " + name + "\nАдреса доставки: " + address + "\nТелефон: " + phone + "\n";
	result = result + "\nЗамовлення:\n";
	cart.forEach(function (pizza) {
		result += "- " + pizza.quantity + "шт. [" + pizza.size.string + "] " + pizza.pizza.title + ";" + "\n";
	});
	result += "\nРазом " + price + " грн";
	return result;
}

exports.createOrder = createOrder;