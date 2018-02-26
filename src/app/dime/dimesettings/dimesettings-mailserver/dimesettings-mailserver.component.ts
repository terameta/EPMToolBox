import { Component, OnInit } from '@angular/core';
import { DimeSettingsService } from '../dimesettings.service';

@Component( {
	selector: 'app-dimesettings-mailserver',
	templateUrl: './dimesettings-mailserver.component.html',
	styleUrls: ['./dimesettings-mailserver.component.scss']
} )
export class DimesettingsMailserverComponent implements OnInit {

	constructor(
		public mainService: DimeSettingsService
	) { }

	ngOnInit() {
	}

}
