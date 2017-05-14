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
			this.staticVerify(refObj).
				then(this.hpEstablishConnection).
				then(this.hpGetDataSources).
				then((innerObj: EnvironmentHP) => {
					if (!innerObj.planningurl) {
						reject("No Planning url is found");
					} else {
						request.post({
							url: innerObj.planningurl,
							body: "<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc=\"0\">en_US</lngs><sso>" + innerObj.sso + "</sso></req_ConnectToProvider>",
							headers: { "Content-Type": "application/xml" }
						}, (err, response, body) => {
							if (err) {
								reject(err);
							} else {
								this.xmlParser(body, (pErr: any, result: any) => {
									if (pErr) {
										reject(pErr);
									} else if (!result) {
										reject("No result at step hpConnectToProvider");
									} else if (!result.res_ConnectToProvider) {
										reject("Result is not valid at step hpConnectToProvider");
									} else if (!result.res_ConnectToProvider.sID) {
										reject("Result is not valid at step hpConnectToProvider [sID]");
									} else if (result.res_ConnectToProvider.sID.length !== 1) {
										reject("Result is not valid at step hpConnectToProvider [sID invalid length]");
									} else {
										innerObj.sID = result.res_ConnectToProvider.sID[0];
										resolve(innerObj);
									}
								})
							}
						});
					}
				}).catch(reject);
		})
	}
	public listApplications = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			this.hpListApplications(refObj).
				then((innerObj: EnvironmentHP) => {
					resolve(innerObj.apps);
				}).
				catch(reject);
		})
	};
	// Old Step0400
	private hpListServers = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			this.hpConnectToProvider(refObj).
				then((innerObj: EnvironmentHP) => {
					request.post({
						url: innerObj.planningurl || "",
						body: "<req_ListServers><sID>" + innerObj.sID + "</sID></req_ListServers>",
						headers: { "Content-Type": "application/xml" }
					}, (err, response, body) => {
						if (err) {
							reject(err);
						} else {
							this.xmlParser(body, (pErr: any, pResult: any) => {
								if (pErr) {
									reject(pErr);
								} else if (!pResult) {
									reject("No result  at hpListServers");
								} else if (!pResult.res_ListServers) {
									reject("Result is not valid at step hpListServers");
								} else if (!pResult.res_ListServers.srvs) {
									reject("Result is not valid at step hpListServers [srvs]");
								} else {
									innerObj.server = pResult.res_ListServers.srvs[0]._;
									resolve(innerObj);
								}
							});
						}
					});
				}).catch(reject);
		});
	};
	// Old Step0500
	private hpListApplications = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			this.hpListServers(refObj).
				then((innerObj: EnvironmentHP) => {
					request.post({
						url: innerObj.planningurl || "",
						body: "<req_ListApplications><sID>" + innerObj.sID + "</sID><srv>" + innerObj.server + "</srv><type></type><url></url></req_ListApplications>",
						headers: { "Content-Type": "application/xml" }
					}, (err, response, body) => {
						if (err) {
							reject(err);
						} else {
							this.xmlParser(body, (pErr: any, pResult: any) => {
								if (pErr) {
									reject(pErr);
								} else if (!pResult) {
									reject("No result at step hpListApplications");
								} else if (!pResult.res_ListApplications) {
									reject("Result is not valid at step hpListApplications");
								} else if (!pResult.res_ListApplications.apps) {
									reject("Result is not valid at hpListApplications [apps]");
								} else if (pResult.res_ListApplications.apps.length !== 1) {
									reject("Result is not valid at step hpListApplications [apps length]");
								} else {
									innerObj.apps = pResult.res_ListApplications.apps[0]._.split("|").sort();
									if (!innerObj.apps) {
										reject("No applications listed");
									} else {
										innerObj.apps.forEach((curApp, curKey) => {
											if (innerObj.apps) { innerObj.apps[curKey] = { name: curApp }; }
										});
										resolve(innerObj);
									}
								}
							})
						}
					})
				}).catch(reject);
		});
	};
	public listCubes = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			this.hpListCubes(refObj).
				then((innerObj: EnvironmentHP) => {
					if (!innerObj.cubes) {
						reject("No cubes are found");
					} else {
						let toReturn: any[];
						toReturn = [];
						innerObj.cubes.forEach((curCube) => {
							toReturn.push({ name: curCube, type: "cube" });
						});
						resolve(toReturn)
					}
				}).
				catch(reject);
		});
	};
	// Old Step0600
	private hpOpenApplication = (refObj: EnvironmentHP) => {
		let curBody = "";
		return new Promise((resolve, reject) => {
			this.hpListApplications(refObj).
				then((innerObj: EnvironmentHP) => {
					curBody = "<req_OpenApplication>";
					curBody += "<sID>" + innerObj.sID + "</sID>";
					curBody += "<srv>" + innerObj.server + "</srv>";
					curBody += "<app>" + innerObj.database + "</app>";
					curBody += "<type></type><url></url>";
					curBody += "<sso>" + innerObj.sso + "</sso>";
					curBody += "</req_OpenApplication>";

					request.post({
						url: innerObj.planningurl || "",
						body: curBody,
						headers: { "Content-Type": "application/xml" }
					}, (err, response, body) => {
						if (err) {
							reject(err);
						} else {
							this.xmlParser(body, (pErr: any, pResult: any) => {
								if (pErr) {
									reject(pErr);
								} else if (!pResult) {
									reject("No result at step hpOpenApplication");
								} else if (!pResult.res_OpenApplication) {
									reject("Result is not valid at step hpOpenApplication");
								} else if (!pResult.res_OpenApplication.sID) {
									reject("Result is not valid at step hpOpenApplication [sID]");
								} else {
									resolve(innerObj);
								}
							});
						}
					});
				}).
				catch(reject);
		});
	};
	// Old Step0700
	private hpGetAvailableServices = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			this.hpOpenApplication(refObj).
				then((innerObj: EnvironmentHP) => {
					request.post({
						url: innerObj.planningurl || "",
						body: "<req_GetAvailableServices><sID>" + refObj.sID + "</sID><CubeView/></req_GetAvailableServices>",
						headers: { "Content-Type": "application/xml" }
					}, (err, response, body) => {
						if (err) {
							reject(err);
						} else {
							this.xmlParser(body, (pErr: any, pResult: any) => {
								if (pErr) {
									reject(pErr);
								} else if (!pResult) {
									reject("No result at step hpGetAvailableServices");
								} else if (!pResult.res_GetAvailableServices) {
									reject("Result is not valid at step hpGetAvailableServices");
								} else {
									resolve(innerObj);
								}
							});
						}
					});
				}).
				catch(reject);
		});
	};
	// Old Step0800
	private hpListDocuments = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			this.hpGetAvailableServices(refObj).
				then((innerObj: EnvironmentHP) => {
					request.post({
						url: innerObj.planningurl || "",
						body: "<req_ListDocuments><sID>" + refObj.sID + "</sID><type>all</type><folder>/</folder><ODL_ECID>0000</ODL_ECID></req_ListDocuments>",
						headers: { "Content-Type": "application/xml" }
					}, (err, response, body) => {
						if (err) {
							reject(err);
						} else {
							this.xmlParser(body, (pErr: any, pResult: any) => {
								if (pErr) {
									reject(pErr);
								} else if (!pResult) {
									reject("No result at step hpListDocuments");
								} else if (!pResult.res_ListDocuments) {
									reject("Result is not valid at step hpListDocuments");
								} else {
									resolve(innerObj);
								}
							});
						}
					})
				}).
				catch(reject);
		})
	};
	// Old Step0900
	private hpListCubes = (refObj: EnvironmentHP) => {
		return new Promise((resolve, reject) => {
			this.hpListDocuments(refObj).
				then((innerObj: EnvironmentHP) => {
					request.post({
						url: innerObj.planningurl || "",
						body: "<req_ListCubes><sID>" + refObj.sID + "</sID><srv>" + refObj.server + "</srv><app>" + refObj.database + "</app><type></type><url></url></req_ListCubes>",
						headers: { "Content-Type": "application/xml" }
					}, (err, response, body) => {
						if (err) {
							reject(err);
						} else {
							this.xmlParser(body, (pErr: any, pResult: any) => {
								if (pErr) {
									reject(pErr);
								} else if (!pResult) {
									reject("No result at step hpListCubes");
								} else if (!pResult.res_ListCubes) {
									reject("Result is not valid at step hpListCubes");
								} else if (!pResult.res_ListCubes.cubes) {
									reject("Result is not valid at step hpListCubes [cubes]");
								} else if (pResult.res_ListCubes.cubes.length !== 1) {
									reject("Result is not valid at step hpListCubes [cubes length]");
								} else {
									innerObj.cubes = pResult.res_ListCubes.cubes[0]._.split("|").sort();
									resolve(innerObj);
								}
							});
						}
					});
				}).
				catch();
		});
	};
}
