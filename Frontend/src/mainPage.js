$(function(){
	//This code will execute when the page is ready
    var PizzaCart = require('./PizzaCart');
	var PizzaMenu = require('./PizzaMenu');
    PizzaMenu.initializeMenu();
    PizzaCart.initializeCart();
});