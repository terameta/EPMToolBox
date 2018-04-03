import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';

@Component( {
	selector: 'app-dime-stream-detail-export-list',
	templateUrl: './dime-stream-detail-export-list.component.html',
	styleUrls: ['./dime-stream-detail-export-list.component.scss']
} )
export class DimeStreamDetailExportListComponent implements OnInit {

	constructor(
		public mainService: DimeStreamService
	) { }

	ngOnInit() {
	}

	public create = () => {
		const name = prompt( 'Please provide a name for the new export' );
		const id = this.mainService.currentItem.exports.reduce( ( accumulator, currentValue ) => Math.max( accumulator, currentValue ), 1 );
		this.mainService.currentItem.exports.push( { id, name } );
		this.mainService.update();
	}

}
