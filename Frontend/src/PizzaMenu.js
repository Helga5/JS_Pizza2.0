var Templates = require("./Templates");
var PizzaCart = require("./PizzaCart"); // Чтобы была возможность вызвать addToCart(pizza)
var API = require("./API");

var Pizza_List;

//HTML едемент куди будуть додаватися піци
var $pizza_container = $("#pizza_list");
var $pizza_count = $("#head-counter");

function initializeMenu() {
	//Показуємо усі піци
	API.getPizzaList(function (err, pizza) {
		// pizza мы получим, когда выполнится запрос на сервер
		Pizza_List = pizza;
		showPizzaList(Pizza_List);
	});
	setTitle("all");
}

initializeFilters();

function showPizzaList(list) {
	//Очищаємо старі піци в кошику
	$pizza_container.html("");
	$pizza_count.text(list.length);

	//Онволення однієї піци
	function showOnePizza(pizza) {
		var html_code = Templates.PizzaMenu_OneItem({ pizza: pizza });
		var $node = $(html_code);

		$node.find(".buy-big").click(function () {
			PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
		});
		$node.find(".buy-small").click(function () {
			PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
		});

		$pizza_container.append($node);
	}

	list.forEach(function (item) {
		showOnePizza(item);
	});
}

function filterPizza(filter) {
	if (filter === "all") {
		setTitle("all");
		showPizzaList(Pizza_List);
		return;
	}

	//Масив куди потраплять піци які треба показати
	var pizza_shown = [];

	Pizza_List.forEach(function (pizza) {
		if (filter === "meat" && pizza.content.meat) pizza_shown.push(pizza);
		else if (filter === "fish" && pizza.content.ocean) pizza_shown.push(pizza);
		else if (filter === "pineapple" && pizza.content.pineapples) pizza_shown.push(pizza);
		else if (filter === "mushrooms" && pizza.content.mushrooms) pizza_shown.push(pizza);
		else if (filter === "vegan" && !pizza.content.meat && !pizza.content.chicken && !pizza.content.ocean)
			pizza_shown.push(pizza);
	});
	setTitle(filter);

	//Показати відфільтровані піци
	showPizzaList(pizza_shown);
}

// Деактивируем текущий фильтр
function clearFilter() {
	$("#range-nav").children().each(function () {
			$(this).removeClass("active");
	});
}

function initializeFilters() {
	$("#all").click(function () {
		clearFilter();
		$("#all").addClass("active");
		filterPizza("all");
	});
	$("#meat").click(function () {
		clearFilter();
		$("#meat").addClass("active");
		filterPizza("meat");
	});
	$("#pineapple").click(function () {
		clearFilter();
		$("#pineapple").addClass("active");
		filterPizza("pineapple");
	});
	$("#fish").click(function () {
		clearFilter();
		$("#fish").addClass("active");
		filterPizza("fish");
	});
	$("#mushrooms").click(function () {
		clearFilter();
		$("#mushrooms").addClass("active");
		filterPizza("mushrooms");
	});
	$("#vegan").click(function () {
		clearFilter();
		$("#vegan").addClass("active");
		filterPizza("vegan");
	});
}

function setTitle(filter) {
	if(filter === "all") $("#head-label").text("Усі піци");
	else if(filter === "meat") $("#head-label").text("Піци з м'ясом");
	else if(filter === "pineapples") $("#head-label").text("Піци з ананасами");
	else if(filter === "fish") $("#head-label").text("Піци з морепродуктами");
	else if(filter === "mushrooms") $("#head-label").text("Піци з грибами");
	else if(filter === "vegan") $("#head-label").text("Піци вега");
}

exports.filterPizza = filterPizza;
exports.initializeMenu = initializeMenu;
