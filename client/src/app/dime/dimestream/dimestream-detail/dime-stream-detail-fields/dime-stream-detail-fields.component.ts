import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';
import { DimeEnvironmentService } from 'app/dime/dimeenvironment/dimeenvironment.service';

@Component( {
	selector: 'app-dime-stream-detail-fields',
	templateUrl: './dime-stream-detail-fields.component.html',
	styleUrls: ['./dime-stream-detail-fields.component.css']
} )
export class DimeStreamDetailFieldsComponent implements OnInit {

	constructor(
		public mainService: DimeStreamService,
		public environmentService: DimeEnvironmentService
	) { }

	ngOnInit() {
	}

	public isEnvironmentThisType = ( typeName: string ) => {
		if ( this.environmentService.itemObject[this.mainService.currentItem.environment] ) {
			return this.environmentService.typeObject[this.environmentService.itemObject[this.mainService.currentItem.environment].type].label === typeName;
		}
		return false;
	}

}
