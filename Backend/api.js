var list = require("./data/PizzaList");
var order_creator = require("./orderCreator"); // Создан для создания информации о заказе

exports.getPizzaList = function(req, res) {
	res.send(list);
};

exports.createOrder = function(req, res) {
	var order = req.body;
	var string = order_creator.createOrder(order);

	res.send(string);
};
