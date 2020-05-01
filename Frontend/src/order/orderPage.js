$(function () {
	var API = require("../API");
	var order_cart = require("./OrderCart");
	var maps = require("./maps");

	order_cart.initializeCart();
	initializeForm();

	function initializeForm() {
		initializeName();
		initializePhone();
		initializeAddress();
		maps.initialize();
	}

	function initializeName() {
		$("#inputName").focusout(function () {
			if (isNameCorrect()) {
				$("#inputName").removeClass("invalid-feedback");
				$("#name-label").removeClass("invalid-feedback");
				$("#name-error").hide();

				$("#inputName").addClass("valid-feedback");
				$("#name-label").addClass("valid-feedback");
			} else {
				$("#inputName").addClass("invalid-feedback");
				$("#name-label").addClass("invalid-feedback");
				$("#name-error").show();

				$("#inputName").removeClass("valid-feedback");
				$("#name-label").removeClass("valid-feedback");
			}
		});
	}

	function initializePhone() {
		$("#inputPhone").focusout(function () {
			if (isPhoneCorrect()) {
				$("#inputPhone").removeClass("invalid-feedback");
				$("#phone-label").removeClass("invalid-feedback");
				$("#phone-error").hide();

				$("#inputPhone").addClass("valid-feedback");
				$("#phone-label").addClass("valid-feedback");
			} else {
				$("#inputPhone").addClass("invalid-feedback");
				$("#phone-label").addClass("invalid-feedback");
				$("#phone-error").show();

				$("#inputPhone").removeClass("valid-feedback");
				$("#phone-label").removeClass("valid-feedback");
			}
		});
	}

	function initializeAddress() {
		$("#inputAddress").focusout(function () {
			if (isAddressCorrect()) {
				maps.processAddress($("#inputAddress").val().trim()); // Передаем адрес, который мы ввели, в гугл карты, чтобы они его обработали
			} else {
				maps.reset();
				$("#inputAddress").addClass("invalid-feedback");
				$("#address-label").addClass("invalid-feedback");
				$("#address-error").show();

				$("#inputAddress").removeClass("valid-feedback");
				$("#address-label").removeClass("valid-feedback");
			}
		});
	}

	function isNameCorrect() {
		var val = $("#inputName").val().trim();
		for (var i = 0; i < val.length; i++)
			if (val.charAt(i) !== " " && val.charAt(i).toLowerCase() === val.charAt(i).toUpperCase()) return false;
		return val.length > 6;
	}

	function isAddressCorrect() {
		var val = $("#inputAddress").val().trim();
		return val.length > 12;
	}

	function isPhoneCorrect() {
		var val = $("#inputPhone").val().trim();
		for (var i = 0; i < val.length; i++)
			if ((val.charAt(i) < "0" || val.charAt(i) > "9") && val.charAt(i) !== "+") return false;

		if (val.length === 13) return val.substring(0, 4) === "+380";
		if (val.length === 10) return val.charAt(0) === "0";

		return false;
	}

	$("#forward").click(function () {
		if (isNameCorrect() && isPhoneCorrect() && isAddressCorrect()) {
			var order = {
				name: $("#inputName").val().trim(),
				phone: $("#inputPhone").val().trim(),
				address: $("#inputAddress").val().trim(),
				cart: order_cart.getPizzaInCart(),
			};
			API.createOrder(order, function (error, result) {
				if (error) return;
				var info = JSON.parse(result);
				initializeLiqpay(info.data, info.signature);
			});
		} else return;
	});

	function initializeLiqpay(data, signature) {
		LiqPayCheckout.init({
			data: data,
			signature: signature,
			mode: "popup", // Наложение, сверху, никуда не дописываем
		})
			.on("liqpay.callback", function (result) { // Типа click, но выполнится, когда произойдет событие "liqpay.callback"
				if (result.status === "sandbox") {
					order_cart.clearCart();
					alert("Order completed!");
					window.location.href = "/"; // Возвращаемся на главную страницу, когда оплатили заказ
				} else return;
			});
	}
});
