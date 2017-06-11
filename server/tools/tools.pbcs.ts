import * as request from 'request';
import * as xml2js from 'xml2js';
const cheerio = require('cheerio');

import { DimeEnvironmentPBCS } from '../../shared/model/dime/environmentPBCS';
import { MainTools } from './tools.main';

export class PBCSTools {
	xmlParser: any;

	constructor(public tools: MainTools) {
		this.xmlParser = xml2js.parseString;
	}

	public verify = (refObj: DimeEnvironmentPBCS) => {
		return this.initiateRest(refObj);

	};
	private initiateRest = (refObj: DimeEnvironmentPBCS) => {
		return this.staticVerify(refObj).
			then(this.pbcsGetVersion);
	}
	private staticVerify = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			if (!refObj) {
				reject('No data provided');
			} else if (!refObj.username) {
				reject('No username provided');
			} else if (!refObj.password) {
				reject('No password provided');
			} else if (!refObj.server) {
				reject('No server is provided');
			} else if (!refObj.port) {
				reject('No port is provided');
			} else if (refObj.server.substr(0, 4) !== 'http') {
				reject('Server address is not valid. Make sure it starts with http:// or https://');
			} else {
				refObj.address = refObj.server + ':' + refObj.port;
				refObj.resturl = refObj.address + '/HyperionPlanning/rest';
				refObj.smartviewurl = refObj.address + '/workspace/SmartViewProviders';
				resolve(refObj);
			}
		});
	};
	private pbcsGetVersion = (refObj: DimeEnvironmentPBCS) => {
		// console.log(refObj.resturl);
		return new Promise((resolve, reject) => {
			request.get({
				url: refObj.resturl + '/',
				auth: {
					user: refObj.username,
					pass: refObj.password,
					sendImmediately: true
				},
				headers: { 'Content-Type': 'application/json' }
			}, (err, response: request.RequestResponse, body) => {
				if (err) {
					reject(err);
				} else {
					this.tools.parseJsonString(body).
						then((result: any) => {
							if (!result.items) {
								reject('No version items');
							} else {
								result.items.forEach((curItem: any) => {
									if (curItem.lifecycle === 'active') {
										refObj.version = curItem.version
										refObj.resturl += '/' + refObj.version;
									}
								});
								if (refObj.version) {
									// console.log(refObj);
									resolve(refObj);
								} else {
									reject('No active version found');
								}
							}
						}).
						catch(reject);
				}
			});
		});
	}
	public listApplications = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			this.pbcsGetApplications(refObj).
				then((innerObj: DimeEnvironmentPBCS) => {
					resolve(innerObj.apps);
				}).
				catch(reject);
		});
	}
	private pbcsGetApplications = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			this.initiateRest(refObj).
				then((innerObj: DimeEnvironmentPBCS) => {
					request.get({
						url: innerObj.resturl + '/applications',
						auth: {
							user: innerObj.username,
							pass: innerObj.password,
							sendImmediately: true
						},
						headers: { 'Content-Type': 'application/json' }
					}, (err, response, body) => {
						if (err) {
							reject(err);
						} else {
							this.tools.parseJsonString(body).
								then((result: any) => {
									if (!result) {
										reject('No response received at pbcsGetApplications');
									} else if (!result.items) {
										reject('No items received at pbcsGetApplications');
									} else {
										innerObj.apps = [];
										result.items.forEach((curItem: any) => {
											if (innerObj.apps) { innerObj.apps.push({ name: curItem.name }); }
										});
										console.log(result);
										resolve(innerObj);
									}
								}).
								catch(reject);
						}
					});
				}).
				catch(reject);
		});
	}
	public listCubes = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			this.pbcsGetCubes(refObj).
				then((innerObj: DimeEnvironmentPBCS) => {
					reject('Not yet');
				}).
				catch(reject);
		});
	}
	private pbcsGetCubes = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			this.initiateRest(refObj).
				then((innerObj: DimeEnvironmentPBCS) => {
					request.get({
						url: innerObj.resturl + '/applications/' + innerObj.database + '/',
						auth: {
							user: innerObj.username,
							pass: innerObj.password,
							sendImmediately: true
						},
						headers: { 'Content-Type': 'application/json' }
					}, (err, response, body) => {
						if (err) {
							reject(err);
						} else {
							console.log(response);
							this.tools.parseJsonString(body).
								then((result: any) => {
									console.log(result);
									reject('Hdere');
								}).
								catch(reject);
						}
					});
				}).
				catch(reject);
		});
	};
	public listRules = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			console.log('!!!!!!!!!!!!');
			console.log('Update this part of the tools.pbcs.ts file');
			console.log('!!!!!!!!!!!!');
			reject('Update this part of the tools.pbcs.ts file');
		});
	};
	public listRuleDetails = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			console.log('!!!!!!!!!!!!');
			console.log('Update this part of the tools.pbcs.ts file');
			console.log('!!!!!!!!!!!!');
			reject('Update this part of the tools.pbcs.ts file');
		});
	};
	public runProcedure = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			console.log('!!!!!!!!!!!!');
			console.log('Update this part of the tools.pbcs.ts file');
			console.log('!!!!!!!!!!!!');
			reject('Update this part of the tools.pbcs.ts file');
		});
	};
	public getDescriptions = (refObj: any) => {
		return new Promise((resolve, reject) => {
			this.pbcsLoginInitiate(refObj).
				then((result) => {
					console.log('===========================================');
					console.log('===========================================');
					console.log(result);
					console.log('===========================================');
					console.log('===========================================');
					reject('getDescriptions pbcs is not ready yet');
				}).
				catch(reject);
			// then((innerObj: DimeEnvironmentPBCS) => {
			// 	request.get({
			// 		url: innerObj.resturl + '/applications/' + innerObj.database + '/dimensions/' + innerObj.field.name + '/members/' + innerObj.field.name,
			// 		auth: {
			// 			user: innerObj.username,
			// 			pass: innerObj.password,
			// 			sendImmediately: true
			// 		},
			// 		headers: { 'Content-Type': 'application/json' }
			// 	}, (err, response, body) => {
			// 		if (err) {
			// 			reject(err);
			// 		} else {
			// 			console.log(response);
			// 			this.tools.parseJsonString(body).
			// 				then((result: any) => {
			// 					console.log(result);
			// 					reject('Hdere');
			// 				}).
			// 				catch(reject);
			// 		}
			// 	});
			// }).
			// catch(reject);
		});
	};
	private pbcsLogin = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			request.post({
				url: 'https://login.em2.oraclecloud.com/oam/server/auth_cred_submit',
				form: {
					username: 'aliriza.dikici@kerzner.com',
					userid: 'aliriza.dikici@kerzner.com',
					password: 'PXzFx9rF6fDOI3tWROF48wai7zya71Si',
					tenantName: 'kerzner',
					tenantDisplayName: 'kerzner'
				}
			}, (err, response, body) => {
				if (err) {
					reject(err);
				} else {
					resolve(body);
				}
			})
		});
	};
	private pbcsLoginInitiate = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			this.staticVerify(refObj).
				then(this.pbcsLoginStep1).
				then(this.pbcsLoginStep2).
				then((result) => {
					console.log('===========================================');
					console.log('===========================================');
					console.log(result);
					console.log('===========================================');
					console.log('===========================================');
					reject('not yet');
				}).
				catch(reject);
		});
	};
	private pbcsLoginStep1 = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			request.get(refObj.smartviewurl || '', (err, response, body) => {
				// $('form.signin_form').find('input').each((index: any, element: any) => {
				// 	console.log('>>>>>>>>>>>>>>>>> Input:', $(element).attr('name'), $(element).attr('type'), $(element).attr('value'));
				// });
				// console.log('===========================================');
				// console.log('===========================================');
				if (err) {
					reject(err);
				} else {
					const $ = cheerio.load(body);
					let toResolve: any; toResolve = {};
					let myRequest: any; myRequest = response.request;
					toResolve.url = myRequest.uri.protocol + '//' + myRequest.uri.host + $('form.signin_form').attr('action');
					toResolve.form = {};
					$('form.signin_form').find('input').each((index: any, element: any) => {
						toResolve.form[$(element).attr('name')] = $(element).attr('value');
						if ($(element).attr('name') === 'tenantDisplayName') {
							toResolve.form[$(element).attr('name')] = 'kerzner';
						}
					});
					toResolve.form.username = 'aliriza.dikici@kerzner.com';
					toResolve.form.password = 'PXzFx9rF6fDOI3tWROF48wai7zya71Si';
					toResolve.form.userid = 'aliriza.dikici@kerzner.com';
					toResolve.form.rememberMe = 'false';
					toResolve.form.error_code = null;
					toResolve.form.buttonAction = 'local';
					toResolve.form.tenantName = toResolve.form.tenantDisplayName;
					toResolve.form.troubleShootFlow = null;
					resolve(toResolve);
				}
			});
		});
	};
	private pbcsLoginStep2 = (toPost: { url: string, form: any }) => {
		return new Promise((resolve, reject) => {
			request.post(toPost, (err, response, body) => {
				if (err) {
					reject(err);
				} else {
					reject(body);
					console.log(toPost.form);
				}
			});
		});
	};
	private pbcsConnectToProvider = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			this.staticVerify(refObj).
				then(this.pbcsEstablishConnection).
				then(this.pbcsGetDataSources).
				then((innerObj: DimeEnvironmentPBCS) => {
					if (!innerObj.planningurl) {
						reject('No Planning url is found');
					} else {
						request.post({
							url: innerObj.planningurl,
							body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc="0">en_US</lngs><sso>' + innerObj.sso + '</sso></req_ConnectToProvider>',
							headers: { 'Content-Type': 'application/xml' }
						}, (err, response, body) => {
							if (err) {
								reject(err);
							} else {
								this.xmlParser(body, (pErr: any, result: any) => {
									if (pErr) {
										reject(pErr);
									} else if (!result) {
										reject('No result at step hpConnectToProvider');
									} else if (!result.res_ConnectToProvider) {
										reject('Result is not valid at step hpConnectToProvider');
									} else if (!result.res_ConnectToProvider.sID) {
										reject('Result is not valid at step hpConnectToProvider [sID]');
									} else if (result.res_ConnectToProvider.sID.length !== 1) {
										reject('Result is not valid at step hpConnectToProvider [sID invalid length]');
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
	};
	private pbcsEstablishConnection = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			request.post({
				url: refObj.smartviewurl || '',
				body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd></req_ConnectToProvider>',
				headers: { 'Content-Type': 'application/xml' }
			}, (err, response, body) => {
				if (err) {
					reject(err);
				} else {
					// console.log("hpEstablishConnection, successful");
					resolve(refObj);
				}
			});
		});
	};
	private pbcsGetDataSources = (refObj: DimeEnvironmentPBCS) => {
		return new Promise((resolve, reject) => {
			request.post({
				url: refObj.smartviewurl || '',
				// tslint:disable-next-line:max-line-length
				body: '<req_GetProvisionedDataSources><usr>' + refObj.username + '</usr><pwd>' + refObj.password + '</pwd><filters></filters></req_GetProvisionedDataSources>',
				headers: { 'Content-Type': 'application/xml' }
			}, (err, response, body) => {
				if (err) {
					reject(err);
				} else {
					// console.log("hpGetDataSources, successful");
					this.xmlParser(body, (parseErr: any, result: any) => {
						console.log('===========================================');
						console.log('===========================================');
						console.log(response);
						console.log('===========================================');
						console.log('===========================================');
						if (parseErr) {
							reject(parseErr);
						} else if (!result) {
							reject('No result at step hpGetDataSources');
						} else if (!result.res_GetProvisionedDataSources) {
							reject('Result is not valid at step hpGetDataSources');
						} else if (!result.res_GetProvisionedDataSources.sso) {
							reject('Result is not valid at step hpGetDataSources [sso]');
						} else if (result.res_GetProvisionedDataSources.sso.length !== 1) {
							reject('Result is not valid at step hpGetDataSources [sso invalid length]');
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
								if (curProduct.id === 'HP') {
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
	};
	public writeData = (refObj: any) => {
		return new Promise((resolve, reject) => {
			console.log('!!!!!!!!!!!!');
			console.log('Update writeData part of the tools.pbcs.ts file');
			console.log('!!!!!!!!!!!!');
			reject('Update this part of the tools.pbcs.ts file');
		});
	};
}
