export interface DimeCredential {
	id: number,
	name: string,
	username: string,
	password: string,
	tags: any
}

export interface DimeCredentialDetail extends DimeCredential {
	clearPassword: string
}
