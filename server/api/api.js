"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_environment_1 = require("./api.environment");
const api_stream_1 = require("./api.stream");
const api_process_1 = require("./api.process");
const api_auth_1 = require("./api.auth");
function initializeRestApi(app, refDB, refTools) {
    const apiEnvironment = new api_environment_1.ApiEnvironment(app, refDB, refTools);
    const apiStream = new api_stream_1.ApiStream(app, refDB, refTools);
    api_process_1.apiProcess(app, refDB, refTools);
    api_auth_1.apiAuth(app, refDB, refTools);
}
exports.initializeRestApi = initializeRestApi;
//# sourceMappingURL=api.js.map