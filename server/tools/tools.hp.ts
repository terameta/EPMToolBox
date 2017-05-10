import * as request from "request";
import * as xml2js from "xml2js";

import { EnvironmentHP } from "../../shared/model/environmentHP";
import { MainTools } from "../config/config.tools";

export class HPTools {
	xmlParser: any;

	constructor(public tools: MainTools) {
		this.xmlParser = xml2js.parseString;
	}

	public verify = (refObj: EnvironmentHP) => {
		return this.staticVerify(refObj).
			then(this.hpEstablishConnection).
			then(this.hpGetDataSources).
			then(this.hpConnectToProvider);

		// return new Promise((resolve, reject) => {
		// 	this.staticVerify(refObj).
		// 		then(this.hpEstablishConnection).
		// 		then(this.hpGetDataSources).
		// 		then(this.hpConnectToProvider).
		// 		then((result) => {
		// 			console.log("Successfully completed");
		// 			reject({ issue: "notok" });
		// 		}).catch(reject);
		// });
	}
	private staticVerify = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			if (!refObj) {
				reject("No data provided");
			} else if (!refObj.username) {
				reject("No username provided");
			} else if (!refObj.password) {
				reject("No password provided");
			} else if (!refObj.server) {
				reject("No server is provided");
			} else if (!refObj.port) {
				reject("No port is provided");
			} else if (refObj.server.substr(0, 4) !== "http") {
				reject("Server address is not valid. Make sure it starts with http:// or https://");
			} else {
				refObj.address = refObj.server + ":" + refObj.port;
				refObj.smartviewurl = refObj.address + "/workspace/SmartViewProviders";
				resolve(refObj);
			}
		});
	}
	// Old Step0100
	private hpEstablishConnection = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			request.post({
				url: refObj.smartviewurl || "",
				// tslint:disable-next-line:max-line-length
				body: "<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc=\"0\">en_US</lngs><usr></usr><pwd></pwd></req_ConnectToProvider>",
				headers: { "Content-Type": "application/xml" }
			}, (err, response, body) => {
				if (err) {
					reject(err);
				} else {
					// console.log("hpEstablishConnection, successful");
					resolve(refObj);
				}
			});
		});
	}
	// Old Step0200
	private hpGetDataSources = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			request.post({
				url: refObj.smartviewurl || "",
				// tslint:disable-next-line:max-line-length
				body: "<req_GetProvisionedDataSources><usr>" + refObj.username + "</usr><pwd>" + refObj.password + "</pwd><filters></filters></req_GetProvisionedDataSources>",
				headers: { "Content-Type": "application/xml" }
			}, (err, response, body) => {
				if (err) {
					reject(err);
				} else {
					// console.log("hpGetDataSources, successful");
					this.xmlParser(body, (parseErr: any, result: any) => {
						if (parseErr) {
							reject(parseErr);
						} else if (!result) {
							reject("No result at step hpGetDataSources");
						} else if (!result.res_GetProvisionedDataSources) {
							reject("Result is not valid at step hpGetDataSources");
						} else if (!result.res_GetProvisionedDataSources.sso) {
							reject("Result is not valid at step hpGetDataSources [sso]");
						} else if (result.res_GetProvisionedDataSources.sso.length !== 1) {
							reject("Result is not valid at step hpGetDataSources [sso invalid length]");
						} else {
							refObj.sso = result.res_GetProvisionedDataSources.sso[0];
							let productToAppend: any = {};
							refObj.products = [];
							refObj.sso = result.res_GetProvisionedDataSources.sso[0];
							result.res_GetProvisionedDataSources.Product.forEach((curProduct: any) => {
								// console.log(curProduct.$);
								productToAppend = curProduct.$;
								productToAppend.servers = [];
								curProduct.Server.forEach((curServer: any) => {
									productToAppend.servers.push(curServer.$);
									// console.log("",curServer.$);
								});
								if (refObj.products) { refObj.products.push(productToAppend); }
							});
							refObj.products.forEach((curProduct) => {
								if (curProduct.id === "HP") {
									if (curProduct.servers) {
										if (curProduct.servers[0]) {
											if (curProduct.servers[0].context) {
												refObj.planningurl = refObj.address + curProduct.servers[0].context;
											}
										}
									}
								}
							});
							// console.log(refObj);
							resolve(refObj);
						}
					});
				}
			});
		});
	}
	// Old Step0300
	private hpConnectToProvider = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			if (!refObj.planningurl) {
				reject("No Planning url is found");
			} else {
				request.post({
					url: refObj.planningurl,
					// tslint:disable-next-line:max-line-length
					body: "<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc=\"0\">en_US</lngs><sso>" + refObj.sso + "</sso></req_ConnectToProvider>",
					headers: { "Content-Type": "application/xml" }
				}, (err, response, body) => {
					if (err) {
						reject(err);
					} else {
						this.xmlParser(body, (pErr: any, result: any) => {
							if (pErr) {
								reject(pErr);
							} else if (!result) {
								reject("No result at step 300");
							} else if (!result.res_ConnectToProvider) {
								reject("Result is not valid at step 300");
							} else if (!result.res_ConnectToProvider.sID) {
								reject("Result is not valid at step 300 [sID]");
							} else if (result.res_ConnectToProvider.sID.length !== 1) {
								reject("Result is not valid at step 300 [sID invalid length]");
							} else {
								refObj.sID = result.res_ConnectToProvider.sID[0];
								// console.log(refObj);
								resolve(refObj);
							}
						})
					}
				});
			}
		})
	}
}
