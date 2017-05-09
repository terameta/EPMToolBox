import { IPool } from "mysql";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import * as crypto from "crypto";

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

	public encryptText = (plaintext: string) => {
		// console.log("-------- Encrypt Start ----------------");
		// console.log("Hash:", this.config.hash);
		// console.log("PlTx:", plaintext);
		const cipher = crypto.createCipher("aes-256-ctr", this.config.hash);
		let crypted = cipher.update(plaintext, "utf8","hex");
		crypted += cipher.final("hex");
		// console.log("CrTx:", crypted);
		// console.log("-------- Encrypt End   ----------------");
		return crypted;
	};

	public decryptText = (crypted: string) => {
		// console.log("-------- Decrypt Start ----------------");
		// console.log("Hash:", this.config.hash);
		// console.log("CrTx:", crypted);
		const decipher = crypto.createDecipher("aes-256-ctr", this.config.hash);
		let plaintext = decipher.update(crypted, "hex", "utf8");
		plaintext += decipher.final("utf8");
		// console.log("PlTx:", plaintext);
		// console.log("-------- Decrypt End ----------------");
		return plaintext;
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
