import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { DimeProcessService } from '../dimeprocess.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';
import { DimeMapService } from '../../dimemap/dimemap.service';
import { DimeProcessStep, DimeProcessStepType, getDimeProcessStepTypeNames } from '../../../../../shared/model/dime/process';
import * as _ from 'lodash';

@Component( {
	selector: 'app-dimeprocess-step-detail',
	templateUrl: './dimeprocess-step-detail.component.html',
	styleUrls: ['./dimeprocess-step-detail.component.css']
} )
export class DimeprocessStepDetailComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	public stepid = 0;
	public currentStep: DimeProcessStep = <DimeProcessStep>{};
	private numberofTries = 0;

	public stepTypes = DimeProcessStepType;
	public stepNames = getDimeProcessStepTypeNames();
	public stepTypesArray = _.toArray( DimeProcessStepType );

	constructor(
		private route: ActivatedRoute,
		public mainService: DimeProcessService
	) { }

	ngOnInit() {
		this.subscriptions.push( this.route.params.subscribe( ( params: Params ) => {
			this.stepid = parseInt( params.stepid, 10 );
			this.findCurrentStep();

		} ) );
	}
	ngOnDestroy() {

	}

	private findCurrentStep = () => {
		this.numberofTries++;
		if ( !this.mainService.currentItem.steps ) {
			setTimeout( () => {
				this.findCurrentStep();
			}, 250 );
		} else {
			this.currentStep = this.mainService.currentItem.steps.filter( step => step.id === this.stepid )[0];
		}

	}


}
