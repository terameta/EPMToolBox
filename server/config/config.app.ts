import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as logger from "morgan";

import {IPool} from "mysql";

import { Application } from "express";
import { initializeRestApi } from "../api/api";

export function initiateApplicationWorker(refDB: IPool) {
	const app: Application = express();

	app.enable("trust proxy");

	app.use(bodyParser.json({ limit: "100mb" }));
	app.use(bodyParser.urlencoded({ extended: false}));
	app.use(express.static(path.join(__dirname, "../../client/dist")));

	app.use(helmet());
	app.use(helmet.noCache());

	app.use(logger("short"));

	initializeRestApi(app, refDB);
	// app.use(apiErrorHandler);

	app.set("port", 8000);

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../../dist/index.html"));
	});

	const server: http.Server = app.listen(app.get("port"), () => {
		console.log("Server is now running on port " + server.address().port );
	});

}
