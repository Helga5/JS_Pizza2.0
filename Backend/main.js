var express = require("express");
var path = require("path");
var morgan = require("morgan");
var bodyParser = require("body-parser");

function configureEndpoints(app) {
	// Пользуется данными, которые лежат в pages и api
    var pages = require("./pages");
    var api = require("./api");

    //Налаштування URL за якими буде відповідати сервер
    //Отримання списку піц
    app.get("/api/get-pizza-list/", api.getPizzaList); // Забираем данные
    app.post("/api/create-order/", api.createOrder); // Отправляем данные

    //Сторінки
    //Головна сторінка
    app.get("/", pages.mainPage); // Делает html страницу и возвращает нам

    //Сторінка замовлення
    app.get("/order.html", pages.orderPage);

    //Якщо не підійшов жоден url, тоді повертаємо файли з папки www
    app.use(express.static(path.join(__dirname, "../Frontend/www")));
}

function startServer(port) {
    //Створюється застосунок
    var app = express();

    //Налаштування директорії з шаблонами
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    //Налаштування виводу в консоль списку запитів до сервера
    app.use(morgan("dev"));

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Налаштовуємо сторінки
    configureEndpoints(app);

    //Запуск додатка за вказаним портом
    app.listen(port, () => {
        console.log("My Application Running on http://localhost:" + port + "/");
    });
}

exports.startServer = startServer;