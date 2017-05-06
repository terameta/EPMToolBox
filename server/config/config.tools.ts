import { IPool } from "mysql";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

export class MainTools {
	config: any;

	constructor(refConfig: any) {
		this.config = refConfig;
	}

	generateLongString(sentLength?: number): string {
		const length: number = sentLength || 128;
		const charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()$^!_%|";
		const n = charset.length;
		let retVal = "";
		for (let i = 0; i < length; i++) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		return retVal;
	}

	signToken(toSign: string): string {
		return jwt.sign(toSign, this.config.hash, { expiresIn: 60 * 60 * 24 * 30 });
	}

	// checkToken(req: Request, res: Response, next: Function) {
	// 	const token = req.body.token || req.query.token || req.headers["x-access-token"];
	// 	if (token) {
	// 		jwt.verify(token, this.config.hash, function (err: Error, decoded: Object) {
	// 			if (err) {
	// 				return res.status(401).json({ status: "fail", message: "Failed to authenticate token" });
	// 			} else {
	// 				req.curUser = decoded;
	// 				next();
	// 			}
	// 		});
	// 	}
	// }
}
