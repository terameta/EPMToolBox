export interface DimeSetting {
	id: number,
	name: string,
	host?: string,
	port?: number,
	issecure?: boolean,
	rejectunauthorized?: boolean,
	user?: string,
	pass?: string,
	emailaddress?: string,
	fromname?: string
}

export interface DimeSettingOnDB {
	id: number,
	name: string,
	value: any
}

export interface DimeSettingObject {
	[key: string]: DimeSetting
}
