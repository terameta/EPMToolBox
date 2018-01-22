import { DimeProcessService } from '../../dimeprocess.service';
import { Component, OnInit } from '@angular/core';

@Component( {
	selector: 'app-dimeprocess-detail-tab-filtersdatafile',
	templateUrl: './dimeprocess-detail-tab-filtersdatafile.component.html',
	styleUrls: ['./dimeprocess-detail-tab-filtersdatafile.component.css']
} )
export class DimeprocessDetailTabFiltersdatafileComponent implements OnInit {

	constructor( public mainService: DimeProcessService ) { }

	ngOnInit() {
	}

}
