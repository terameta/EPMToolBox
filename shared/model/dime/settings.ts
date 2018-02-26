export interface DimeSetting {
	id: number,
	name: string,
	value: any
}

export interface DimeSettingObject {
	[key: string]: DimeSetting
}

export interface DimeEmailServerSettings {
	host: string,
	port: number
}

export interface DimeSystemAdminSettings {
	emailaddress: string
}
