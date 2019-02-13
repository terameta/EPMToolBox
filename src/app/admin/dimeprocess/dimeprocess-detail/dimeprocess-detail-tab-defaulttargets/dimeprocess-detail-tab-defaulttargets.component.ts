import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';
import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeProcessStepType } from '../../../../../../shared/model/dime/process';
import { ToastrService } from 'ngx-toastr';

@Component( {
	selector: 'app-dimeprocess-detail-tab-defaulttargets',
	templateUrl: './dimeprocess-detail-tab-defaulttargets.component.html',
	styleUrls: ['./dimeprocess-detail-tab-defaulttargets.component.css']
} )
export class DimeprocessDetailTabDefaulttargetsComponent implements OnInit {
	public targetStreamID = 0;
	private numberofIdentifyStreamTrials = 0;

	constructor(
		public mainService: DimeProcessService,
		public streamService: DimeStreamService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.identifyStream();
	}

	public identifyStream = () => {
		if ( this.mainService.currentItem ) {
			if ( this.mainService.currentItem.steps ) {
				this.targetStreamID = this.mainService.currentItem.steps.filter( step => step.type === DimeProcessStepType.PushData ).map( step => step.referedid )[0];
			}
		}

		if ( !this.targetStreamID ) {
			if ( this.numberofIdentifyStreamTrials++ < 500 ) {
				setTimeout( this.identifyStream, 250 );
			} else {
				this.toastr.error( 'Failed to identify target stream. Process is not ready yet.' );
			}
		}
	}

	public updateDefaultTargets = () => this.mainService.defaultTargetsUpdate();

}
