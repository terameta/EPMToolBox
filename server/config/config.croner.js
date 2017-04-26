"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cron = require("cron");
function initiateCronWorker(refDB) {
    let jobPer10Sec = new Cron.CronJob('*/10 * * * * *', function () {
    }, function () {
        console.log("This is the end!");
    }, true, "America/Los_Angeles");
}
exports.initiateCronWorker = initiateCronWorker;
//# sourceMappingURL=config.croner.js.map