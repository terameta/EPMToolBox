import { MainTools } from './tools.main';
import { Pool } from 'mysql';

export class SettingsTool {
	constructor(
		public db: Pool,
		public tools: MainTools
	) { }

	public getAll = () => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM settings', function (err, rows, fields) {
				if (err) {
					reject(err);
				} else {
					rows.forEach((curSetting: any, curKey: number) => {
						if (curSetting.value === '||true||') { rows[curKey].value = true; }
						if (curSetting.value === '||false||') { rows[curKey].value = false; }
					});
					resolve(rows);
				}
			});
		});
	};

	public getOne = (name: string) => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM settings WHERE name = ?', name, function (err, rows, fields) {
				if (err) {
					reject(err);
				} else {
					if (rows.length === 1) {
						rows.forEach((curSetting: any, curKey: number) => {
							if (curSetting.value === '||true||') { rows[curKey].value = true; }
							if (curSetting.value === '||false||') { rows[curKey].value = false; }
						});
						resolve(rows[0]);
					} else {
						reject('No setting found with the given ID.');
					}
				}
			});
		});
	};

	public create = (setting: any) => {
		return new Promise((resolve, reject) => {
			this.db.query('INSERT INTO settings SET ?', setting, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

	public update = (setting: any) => {
		return new Promise((resolve, reject) => {
			if (!setting) {
				reject('Empty body is not accepted.');
			} else {
				this.db.query('UPDATE settings SET ? WHERE name = ?', [setting, setting.name], (err, result, fields) => {
					if (err) {
						reject(err);
					} else {
						resolve('OK');
					}
				});
			}
		});
	};

	public delete = (name: string) => {
		return new Promise((resolve, reject) => {
			this.db.query('DELETE FROM settings WHERE name = ?', name, (err, result, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve('OK');
				}
			});
		});
	}
	public updateAll(allSettings: any) {
		return new Promise((resolve, reject) => {
			this.getAll().
				then((settingsList: any[]) => {
					let doWeHave = false;
					let promises: any[]; promises = [];
					Object.keys(allSettings).forEach((curKey) => {
						doWeHave = false;
						settingsList.forEach((curSetting) => {
							if (curKey === curSetting.name) { doWeHave = true; }
						});
						let curSetting: any; curSetting = {
							name: curKey,
							value: allSettings[curKey]
						};
						if (curSetting.value === true) { curSetting.value = '||true||'; }
						if (curSetting.value === false) { curSetting.value = '||false||'; }

						if (doWeHave) {
							promises.push(this.update(curSetting));
						} else {
							promises.push(this.create(curSetting));
						}

					});
					return Promise.all(promises);
				}).
				then(this.getAll).
				then(resolve).
				catch(reject);
		});
	}
}
