import { Application } from "express";
import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";

import { ApiEnvironment } from "./api.dime.environment";
import { ApiStream } from "./api.dime.stream";
import { ApiProcess } from "./api.dime.process";
import { ApiMap } from "./api.dime.map";

import { apiAuth } from "./api.auth";

export function initializeRestApi(app: Application, refDB: IPool, refTools: MainTools) {
	const apiEnvironment = new ApiEnvironment(app, refDB, refTools);
	const apiStream = new ApiStream(app, refDB, refTools);
	const apiMap = new ApiMap(app, refDB, refTools);
	ApiProcess(app, refDB, refTools);
	apiAuth(app, refDB, refTools);
}
