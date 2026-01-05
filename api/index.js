// const serverless = require("serverless-http");
// const app = require("../backend/app");

// module.exports = serverless(app);


const app = require("../backend/app"); // wherever your express app is exported from
module.exports = app;
