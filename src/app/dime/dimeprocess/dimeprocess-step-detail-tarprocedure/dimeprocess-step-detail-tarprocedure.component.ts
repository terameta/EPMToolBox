import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DimeProcessStep, DimeProcessStepType } from '../../../../../shared/model/dime/process';
import { DimeProcessService } from '../dimeprocess.service';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { SortByName } from '../../../../../shared/utilities/utilityFunctions';

@Component( {
	selector: 'app-dimeprocess-step-detail-tarprocedure',
	templateUrl: './dimeprocess-step-detail-tarprocedure.component.html',
	styleUrls: ['./dimeprocess-step-detail-tarprocedure.component.scss']
} )
export class DimeprocessStepDetailTarprocedureComponent implements OnInit, OnDestroy {
	@Input() currentStep: DimeProcessStep;
	private numberofListProceduresTry = 0;
	public procedures: any[] = [];
	public proceduresAll: any[] = [];
	public filter: string = '';
	private subscriptions: Subscription[] = [];
	private stepid = 0;
	private targetStreamID: number;

	constructor(
		private route: ActivatedRoute,
		public mainService: DimeProcessService,
		private environmentService: DimeEnvironmentService,
		private streamService: DimeStreamService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.subscriptions.push( this.route.params.subscribe( ( params: Params ) => {
			const newid = parseInt( params.stepid, 10 );
			if ( newid !== this.stepid ) {
				this.stepid = newid;
				this.initiateAll();
			}
		} ) );
	}
	ngOnDestroy() {
		this.subscriptions.forEach( sub => sub.unsubscribe() );
	}

	private initiateAll = () => {
		this.initiateStep();
		this.listProcedures();
	}

	private initiateStep = () => {
		if ( !this.currentStep.detailsObject ) {
			this.currentStep.detailsObject = {};
		}
	}

	public applyFilter = () => {
		if ( this.filter ) {
			this.procedures = this.proceduresAll.filter( proc => proc.name.toString().toLowerCase().indexOf( this.filter.toLowerCase() ) >= 0 );
		} else {
			this.procedures = this.proceduresAll;
		}
	}

	public stepProcedureSelected = ( selectedProcedure: any, numTry?: number ) => {
		if ( selectedProcedure !== undefined ) {
			this.currentStep.detailsObject.name = selectedProcedure.name;
			this.currentStep.detailsObject.hasRTP = selectedProcedure.hasRTP;
		}
		this.toastr.info( 'Retrieving procedure details...' );
		this.environmentService.listProcedureDetails( this.mainService.currentItem.target, { stream: this.streamService.itemObject[this.targetStreamID], procedure: selectedProcedure } ).
			subscribe( ( data ) => {
				if ( Array.isArray( data ) ) {
					this.currentStep.detailsObject.variables = data;
					this.toastr.info( 'Received procedure details' );
				} else {
					this.toastr.error( 'We could not receive a proper definition for the procedure.' );
				}
			}, ( error ) => {
				this.toastr.error( 'Failed to receive procedure details.' );
				console.log( error );
			} );
	}
	public listProcedures = () => {
		this.targetStreamID = this.mainService.currentItem.steps.filter( step => step.type === DimeProcessStepType.PushData ).map( step => step.referedid )[0];

		if ( this.mainService.currentItem.target && this.targetStreamID && this.streamService.itemObject[this.targetStreamID] ) {
			const targetStreamName = this.streamService.itemObject[this.targetStreamID].name;
			this.environmentService.listProcedures( this.mainService.currentItem.target, this.streamService.itemObject[this.targetStreamID] ).subscribe( ( result: any[] ) => {
				this.proceduresAll = result.sort( SortByName );
				this.applyFilter();
			}, error => {
				console.error( error );
			} );
		} else if ( this.numberofListProceduresTry++ < 500 ) {
			setTimeout( this.listProcedures, 250 );
		} else {
			this.toastr.error( 'Failed to list procedures. Process is not ready yet.' );
		}
	}

}
