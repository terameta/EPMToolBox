import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';

@Component( {
	selector: 'app-dime-stream-detail-field-descriptions',
	templateUrl: './dime-stream-detail-field-descriptions.component.html',
	styleUrls: ['./dime-stream-detail-field-descriptions.component.css']
} )
export class DimeStreamDetailFieldDescriptionsComponent implements OnInit {

	constructor( public mainService: DimeStreamService ) { }

	ngOnInit() {
	}

	public doWeHaveDescribedFields = () => {
		if ( !this.mainService.currentItem ) {
			return false;
		} else if ( !this.mainService.currentItem.fieldList ) {
			return false;
		} else if ( this.mainService.currentItem.fieldList.length === 0 ) {
			return false;
		} else {
			return this.mainService.currentItem.fieldList.map( currentField => parseInt( currentField.isDescribed.toString(), 10 ) ).reduce( ( accumulator, currentItem ) => accumulator + currentItem ) > 0;
		}
	}

}
