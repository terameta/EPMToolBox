import { Application } from "express";

export function apiEnvironment(app: Application) {
	app.route("/api/environment").get( (req, res) => {
		res.send("OK");
	});
}
