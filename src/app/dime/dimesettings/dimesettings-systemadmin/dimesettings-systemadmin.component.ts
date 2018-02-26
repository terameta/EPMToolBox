import { Component, OnInit } from '@angular/core';
import { DimeSettingsService } from '../dimesettings.service';

@Component( {
	selector: 'app-dimesettings-systemadmin',
	templateUrl: './dimesettings-systemadmin.component.html',
	styleUrls: ['./dimesettings-systemadmin.component.scss']
} )
export class DimesettingsSystemadminComponent implements OnInit {

	constructor(
		public mainService: DimeSettingsService
	) { }

	ngOnInit() {
	}

}
