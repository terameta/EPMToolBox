"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_environment_1 = require("./api.environment");
const api_process_1 = require("./api.process");
function initializeRestApi(app, refDB) {
    api_environment_1.apiEnvironment(app, refDB);
    api_process_1.apiProcess(app, refDB);
}
exports.initializeRestApi = initializeRestApi;
//# sourceMappingURL=api.js.map