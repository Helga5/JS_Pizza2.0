var API_URL = "http://localhost:5050"; // Адрес сервера, к которому мы обращаемся, чтобы получить список пицц

function backendGet(url, callback) {
    $.ajax({ // Библиотека, которая отвечает за то, чтобы делать запросы
        url: API_URL + url,
        type: "GET",
        success: function(data) {
            callback(null, data);
        },
        error: () => {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: "POST",
        contentType : "application/json",
        data: JSON.stringify(data),
        success: function(data) {
            callback(null, data);
        },
        error: () => {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.getPizzaList = function(callback) {
    backendGet("/api/get-pizza-list/", callback); // Забрать пиццы
};

exports.createOrder = function(orderInfo, callback) {
    backendPost("/api/create-order/", orderInfo, callback); // Оформить заказ
};
