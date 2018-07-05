export interface SystemConfig {
	hash: string,
	mysql: MysqlConfig,
	numberofCPUs?: number
}

interface MysqlConfig {
	host: string,
	port: number,
	user: string,
	pass: string,
	db: string
}
