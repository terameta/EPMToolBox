export interface DimeSecret {
	id: number,
	name: string,
	whiteList: string[],
	secret: string
}

export interface DimeSecretObject {
	[key: number]: DimeSecret
}
