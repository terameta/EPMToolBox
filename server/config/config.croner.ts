import * as Cron from "cron";
import { IPool } from "mysql";

export function initiateCronWorker(refDB: IPool) {
	let jobPer10Sec = new Cron.CronJob('*/10 * * * * *',function(){console.log("Every 10 secs", new Date());}, function(){ console.log("This is the end");},true,"America/Los_Angeles");
}
