"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_environment_1 = require("./api.environment");
function initializeRestApi(app, refDB) {
    api_environment_1.apiEnvironment(app, refDB);
}
exports.initializeRestApi = initializeRestApi;
//# sourceMappingURL=api.js.map