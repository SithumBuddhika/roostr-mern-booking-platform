const serverless = require("serverless-http");
const app = require("../backend/app");

module.exports = serverless(app);
