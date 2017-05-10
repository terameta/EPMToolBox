"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const xml2js = require("xml2js");
class PBCSTools {
    constructor(tools) {
        this.tools = tools;
        this.verify = (refObj) => {
            return this.initiateRest(refObj);
        };
        this.initiateRest = (refObj) => {
            return this.staticVerify(refObj).
                then(this.pbcsGetVersion);
        };
        this.staticVerify = (refObj) => {
            return new Promise((resolve, reject) => {
                if (!refObj) {
                    reject("No data provided");
                }
                else if (!refObj.username) {
                    reject("No username provided");
                }
                else if (!refObj.password) {
                    reject("No password provided");
                }
                else if (!refObj.server) {
                    reject("No server is provided");
                }
                else if (!refObj.port) {
                    reject("No port is provided");
                }
                else if (refObj.server.substr(0, 4) !== "http") {
                    reject("Server address is not valid. Make sure it starts with http:// or https://");
                }
                else {
                    refObj.address = refObj.server + ":" + refObj.port;
                    refObj.resturl = refObj.address + "/HyperionPlanning/rest";
                    resolve(refObj);
                }
            });
        };
        this.pbcsGetVersion = (refObj) => {
            return new Promise((resolve, reject) => {
                request.get({
                    url: refObj.resturl + "/",
                    auth: {
                        user: refObj.username,
                        pass: refObj.password,
                        sendImmediately: true
                    },
                    headers: { "Content-Type": "application/json" }
                }, (err, response, body) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.tools.parseJsonString(body).
                            then((result) => {
                            if (!result.items) {
                                reject("No version items");
                            }
                            else {
                                result.items.forEach((curItem) => {
                                    if (curItem.lifecycle === "active") {
                                        refObj.version = curItem.version;
                                        refObj.resturl += "/" + refObj.version;
                                    }
                                });
                                if (refObj.version) {
                                    resolve(refObj);
                                }
                                else {
                                    reject("No active version found");
                                }
                            }
                        }).
                            catch(reject);
                    }
                });
            });
        };
        this.xmlParser = xml2js.parseString;
    }
}
exports.PBCSTools = PBCSTools;
//# sourceMappingURL=tools.pbcs.js.map