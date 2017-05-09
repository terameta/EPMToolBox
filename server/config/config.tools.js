"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
class MainTools {
    constructor(refConfig) {
        this.encryptText = (plaintext) => {
            const cipher = crypto.createCipher("aes-256-ctr", this.config.hash);
            let crypted = cipher.update(plaintext, "utf8", "hex");
            crypted += cipher.final("hex");
            return crypted;
        };
        this.decryptText = (crypted) => {
            const decipher = crypto.createDecipher("aes-256-ctr", this.config.hash);
            let plaintext = decipher.update(crypted, "hex", "utf8");
            plaintext += decipher.final("utf8");
            return plaintext;
        };
        this.config = refConfig;
    }
    generateLongString(sentLength) {
        const length = sentLength || 128;
        const charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()$^!_%|";
        const n = charset.length;
        let retVal = "";
        for (let i = 0; i < length; i++) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
    signToken(toSign) {
        return jwt.sign(toSign, this.config.hash, { expiresIn: 60 * 60 * 24 * 30 });
    }
}
exports.MainTools = MainTools;
//# sourceMappingURL=config.tools.js.map