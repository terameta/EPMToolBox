export interface Credential {
	id: number,
	name: string,
	username: string,
	password: string,
	tags: any
}

export interface CredentialDetail extends Credential {
	clearPassword: string
}
