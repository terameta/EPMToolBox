export interface SmartViewRequestOptions {
	method?: 'POST' | 'GET',
	url: string,
	body?: string,
	contentType?: string,
	cookie?: string,
	timeout?: number,
	followRedirect?: boolean,
	referer?: any,
	form?: any
}
