import { Component, OnInit } from '@angular/core';
import { DimeCredentialService } from 'app/dime/dimecredential/dimecredential.service';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';

@Component( {
	selector: 'app-dimecredential-detail',
	templateUrl: './dimecredential-detail.component.html',
	styleUrls: ['./dimecredential-detail.component.css']
} )
export class DimeCredentialDetailComponent implements OnInit {

	constructor( public mainService: DimeCredentialService, public tagService: DimeTagService ) { }

	ngOnInit() {
	}

	public decideColWidth = ( numCols: number ) => {
		let colWidth = 12;
		if ( numCols > 0 ) {
			colWidth = Math.floor( colWidth / numCols );
		}
		if ( colWidth < 1 ) { colWidth = 1; }
		return colWidth;
	}

}
