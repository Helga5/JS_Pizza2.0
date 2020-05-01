var $map = document.getElementById("googleMap"); // Берем div с id googleMap, jquery не подходит

var map;
var marker;
var directions = new google.maps.DirectionsRenderer(); // Сервис, который помогает в рисовании путей

function initialize() {
	var mapProp = {
		center: new google.maps.LatLng(50.464379, 30.519131),
		zoom: 10,
	};
	map = new google.maps.Map($map, mapProp); // div, куда дорисовать карту, mapProp - настройки карты

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(50.464379, 30.519131),
		map: map,
		icon: "assets/images/home-icon.png",
	});

	google.maps.event.addListener(map, "click", processClick);
}

function reset() {
	if (marker) {
		marker.setMap(null);
		directions.setMap(null);
	}
}

function processClick(point) {
	reset();
	var destination = point.latLng;
	geocodeLatLng(destination, function (error, address) { // Функция, которая обрабатывает координаты и находит адрес
		if (!error) {
			drawDestinationMarker(destination);
			findRoute(destination, address);
		} else addressError();
	});
}

function geocodeLatLng(latlng, callback) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({ location: latlng }, function (results, status) {
		if (status === google.maps.GeocoderStatus.OK && results[1]) { // Если все хорошо и находим адрес - вызываем callback и идем дальше
			var address = results[1].formatted_address;
			callback(null, address);
		} else callback(new Error("Input correct address")); // Если нет - вызываем callback и передаем туда Error
	});
}

function drawDestinationMarker(destination) {
	marker = new google.maps.Marker({
		position: destination,
		map: map,
		icon: "assets/images/map-icon.png",
	});
}

function findRoute(destinationPoint, address) {
	var route = {
		origin: new google.maps.LatLng(50.464379, 30.519131),
		destination: destinationPoint,
		travelMode: google.maps.TravelMode["DRIVING"], // Устанавливаем "константу", которая соответствует типу "едем на машне"
	};
	var directionService = new google.maps.DirectionsService(); // Конструктор, который создает обработчик
	directionService.route(route, function (response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			var leg = response.routes[0].legs[0]; // Получаем самый короткий путь
			drawRoute(response);
			addressSuccess(address, leg.duration.text);
		} else addressError();
	});
}

function drawRoute(route) {
	directions.setMap(map);
	directions.setOptions({ suppressMarkers: true });
	directions.setDirections(route);
}

function geocodeAddress(address) {
	reset();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({ address: address }, function (results, status) { // После того, как нашли координаты по адресу, обрабатываем координаты
		if (status === google.maps.GeocoderStatus.OK && results[0]) {
			var destinationPoint = results[0].geometry.location;
			drawDestinationMarker(destinationPoint);
			findRoute(destinationPoint, address);
		} else addressError();
	});
}

function addressError() {
	reset();
	$("#address-result").text("невідома");
	$("#time-result").text("невідомий");

	$("#inputAddress").addClass("invalid-feedback");
	$("#address-label").addClass("invalid-feedback");
	$("#address-error").show();

	$("#inputAddress").removeClass("valid-feedback");
	$("#address-label").removeClass("valid-feedback");
}

function addressSuccess(address, duration) {
	$("#inputAddress").val(address);
	$("#address-result").text(address);
	$("#time-result").text(duration);

	$("#inputAddress").removeClass("invalid-feedback");
	$("#address-label").removeClass("invalid-feedback");
	$("#address-error").hide();

	$("#inputAddress").addClass("valid-feedback");
	$("#address-label").addClass("valid-feedback");
}

exports.initialize = initialize;
exports.processAddress = geocodeAddress;
exports.reset = reset;
