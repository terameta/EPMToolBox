import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DimeSetting } from '../../../../shared/model/dime/settings';

@Injectable()
export class DimeSettingsBackend {
	private baseUrl = '/api/settings';

	constructor( private http: HttpClient ) { }

	public allLoad = () => this.http.get<DimeSetting[]>( this.baseUrl );
	public update = ( payload: DimeSetting ) => this.http.put( this.baseUrl, payload );
}
