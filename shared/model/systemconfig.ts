export interface MysqlConfig {
	host: string,
	port: number,
	user: string,
	pass: string,
	db: string
}

export interface SystemConfig {
	hash: string,
	mysql: MysqlConfig,
	numberofCPUs?: number
}

