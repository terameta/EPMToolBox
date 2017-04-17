"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var api_1 = require("./api/api");
var apiErrorHandler_1 = require("./api/apiErrorHandler");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
api_1.initRestApi(app);
app.use(apiErrorHandler_1.apiErrorHandler);
app.listen(8090, function () {
    console.log('Server is now running on port 8090 ...');
});
//# sourceMappingURL=server.js.map