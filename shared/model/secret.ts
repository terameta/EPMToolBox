export interface DimeSecret {
	id: number,
	details: {
		name: string,
		whiteList: string[],
		secret: string
	}
}

export interface DimeSecretObject {
	[key: number]: DimeSecret
}
