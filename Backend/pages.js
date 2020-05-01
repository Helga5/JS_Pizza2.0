exports.mainPage = (req, res) => {
    res.render("mainPage", {
        js: "main.js" // Передаем в ejs-файл объект с полем js
    });
};

exports.orderPage = (req, res) => {
    res.render("orderPage", {
        js: "order.js"
    });
};