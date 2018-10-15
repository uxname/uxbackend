const fs = require("fs");
const path = require("path");
const routers = [];

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js") && (file !== "node_modules");
    })
    .forEach(function (file) {
        const router = require(path.join(__dirname, file));
        routers.push(router);
    });

module.exports = routers;
