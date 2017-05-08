import { Request, Response, Router } from "express";

import { MainTools } from "../config/config.tools";

export class Rester {
	constructor(public tools: MainTools) { }

	public respond(theFunction: Function, theArgument: any, req: Request, res: Response) {
		theFunction(theArgument).then(function (result: any) {
			res.send(result);
		}).catch(function (issue: any) {
			console.log(issue);
			res.status(500).json({ status: "fail", message: issue });
		});
	}

	public restify(router: Router, tool: any) {
		router.get("/", (req: Request, res: Response) => {
			this.respond(tool.getAll, null, req, res);
		});

		router.get("/:id", (req: Request, res: Response) => {
			this.respond(tool.getOne, req.params.id, req, res);
		});

		router.post("/", (req: Request, res: Response) => {
			this.respond(tool.create, req.body, req, res);
		});

		router.put("/:id", (req: Request, res: Response) => {
			this.respond(tool.update, req.body, req, res);
		});

		router.delete("/:id", (req: Request, res: Response) => {
			this.respond(tool.remove, req.params.id, req, res);
		});
	}
}
