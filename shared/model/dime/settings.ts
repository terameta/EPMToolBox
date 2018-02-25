export interface DimeSetting {
	id: number,
	name: string,
	value: string
}

export interface DimeSettingObject {
	[key: number]: DimeSetting
}

export interface DimeEmailServerSettings {
	host: string,
	port: number
}
