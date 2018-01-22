import { EnumToArray } from '../../../../../shared/utilities/utilityFunctions';
import { ATStatusType } from '../../../../../shared/enums/generic/statustypes';
import { DimeScheduleService } from '../dimeschedule.service';
import { Component, OnInit } from '@angular/core';

@Component( {
	selector: 'app-dimeschedule-list',
	templateUrl: './dimeschedule-list.component.html',
	styleUrls: ['./dimeschedule-list.component.css']
} )
export class DimescheduleListComponent implements OnInit {
	private statusTypeArray = EnumToArray( ATStatusType );

	constructor(
		public mainService: DimeScheduleService
	) {

	}

	ngOnInit() {
	}

	private findStatus = ( n ) => {
		let toReturn: string; toReturn = 'Unknown status';
		this.statusTypeArray.forEach( ( curStatus ) => {
			if ( curStatus.value === parseInt( n, 10 ) ) {
				toReturn = curStatus.label;
			}
		} );
		return toReturn;
	}
}
