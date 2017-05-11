import { Application } from "express";
import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";

import { ApiEnvironment } from "./api.environment";
import { ApiStream } from "./api.stream";


import { apiProcess } from "./api.process";
import { apiAuth } from "./api.auth";

export function initializeRestApi(app: Application, refDB: IPool, refTools: MainTools) {
	const apiEnvironment = new ApiEnvironment(app, refDB, refTools);
	const apiStream = new ApiStream(app, refDB, refTools);
	apiProcess(app, refDB, refTools);
	apiAuth(app, refDB, refTools);
}
