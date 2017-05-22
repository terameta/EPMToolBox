"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_dime_environment_1 = require("./api.dime.environment");
const api_dime_stream_1 = require("./api.dime.stream");
const api_dime_map_1 = require("./api.dime.map");
const api_dime_process_1 = require("./api.dime.process");
const api_auth_1 = require("./api.auth");
function initializeRestApi(app, refDB, refTools) {
    const apiEnvironment = new api_dime_environment_1.ApiEnvironment(app, refDB, refTools);
    const apiStream = new api_dime_stream_1.ApiStream(app, refDB, refTools);
    const apiMap = new api_dime_map_1.ApiMap(app, refDB, refTools);
    const apiProcess = new api_dime_process_1.ApiProcess(app, refDB, refTools);
    api_auth_1.apiAuth(app, refDB, refTools);
}
exports.initializeRestApi = initializeRestApi;
//# sourceMappingURL=api.js.map