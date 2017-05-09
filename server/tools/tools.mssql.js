"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mssql = require("mssql");
class MSSQLTools {
    constructor() {
        this.verify = (refObj) => {
            return this.connect(refObj);
        };
        this.connect = (refObj) => {
            return new Promise((resolve, reject) => {
                const dbConfig = {
                    user: refObj.username || "",
                    password: refObj.password || "",
                    server: refObj.server || "",
                    port: parseInt(refObj.port || "0", 10),
                    connectionTimeout: 300000,
                    requestTimeout: 300000,
                };
                if (refObj.database) {
                    dbConfig.database = refObj.database;
                }
                ;
                refObj.connection = new mssql.ConnectionPool(dbConfig, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(refObj);
                    }
                });
            });
        };
    }
}
exports.MSSQLTools = MSSQLTools;
//# sourceMappingURL=tools.mssql.js.map