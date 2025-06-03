const serverless = require("serverless-http");
const app = require("./dist/infrastructure/server"); // Importar el servidor correctamente

console.log("init serverless");

module.exports.handler = serverless(app);
