import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DimeProcessStep, DimeProcessStepType } from '../../../../../shared/model/dime/process';
import { DimeProcessService } from '../dimeprocess.service';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { SortByName, SortByDescription } from '../../../../../shared/utilities/utilityFunctions';

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
	public filter = '';
	private subscriptions: Subscription[] = [];
	private stepid = 0;
	public targetStreamID: number;
	public isRefreshingProcedureDetails = false;
	private numberofListProcedureDetailsTry = 0;

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
		this.waitForStepChange().then( () => {
			if ( !this.currentStep.detailsObject ) {
				this.currentStep.detailsObject = {};
			}
			if ( this.currentStep.detailsObject.name ) {
				this.filter = this.currentStep.detailsObject.name;
				this.stepProcedureSelected();
			} else {
				this.filter = '';
			}
			this.applyFilter();
			this.initiateStep();
			this.listProcedures();
		} );
	}

	private waitForStepChange = () => {
		return new Promise( ( resolve, reject ) => {
			if ( this.currentStep.id === this.stepid ) {
				resolve();
			} else {
				setTimeout( () => {
					resolve( this.waitForStepChange() );
				}, 250 );
			}
		} );
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

	public stepProcedureSelected = ( selectedProcedure?: any ) => {
		if ( !this.mainService.currentItem ) {
			setTimeout( () => { this.stepProcedureSelected( selectedProcedure ); }, 500 );
		} else if ( !this.mainService.currentItem.target ) {
			setTimeout( () => { this.stepProcedureSelected( selectedProcedure ); }, 500 );
		} else if ( !this.targetStreamID ) {
			setTimeout( () => { this.stepProcedureSelected( selectedProcedure ); }, 500 );
		} else if ( !this.streamService.itemObject[this.targetStreamID] ) {
			setTimeout( () => { this.stepProcedureSelected( selectedProcedure ); }, 500 );
		} else {
			if ( selectedProcedure ) {
				this.currentStep.detailsObject = {};
				this.currentStep.detailsObject.name = selectedProcedure.name;
				this.currentStep.detailsObject.hasRTP = selectedProcedure.hasRTP;
				this.currentStep.detailsObject.type = selectedProcedure.type;
			} else {
				selectedProcedure = Object.assign( {}, this.currentStep.detailsObject );
			}
			this.stepProcedureSelectedAction( selectedProcedure );
		}
	}

	public variableTypeChange = ( variable ) => {
		if ( variable.valuetype === 'manualvalue' ) {
			variable.value = '';
		} else {
			variable.value = variable.dimension;
		}
	}

	public stepProcedureSelectedAction = ( selectedProcedure: any ) => {
		this.isRefreshingProcedureDetails = true;
		this.environmentService.listProcedureDetails( this.mainService.currentItem.target, { stream: this.streamService.itemObject[this.targetStreamID], procedure: selectedProcedure } ).
			subscribe( ( response ) => {
				this.isRefreshingProcedureDetails = false;
				if ( Array.isArray( response ) ) {
					if ( !this.currentStep.detailsObject.variables ) {
						this.currentStep.detailsObject.variables = [];
					}
					this.currentStep.detailsObject.variables.forEach( curVariable => {
						const currentIndex = response.findIndex( element => element.name === curVariable.name );
						if ( currentIndex >= 0 ) {
							response[currentIndex] = Object.assign( response[currentIndex], curVariable );
						}
					} );
					response.forEach( curResponse => {
						if ( curResponse.dimension ) {
							if ( curResponse.valuetype !== 'manualvalue' ) {
								curResponse.value = curResponse.dimension;
							}
						}
					} );
					this.currentStep.detailsObject.variables = response;
					this.toastr.info( 'Received procedure details' );
				} else {
					this.toastr.error( 'We could not receive a proper definition for the procedure.' );
				}
			}, ( error ) => {
				this.isRefreshingProcedureDetails = false;
				this.toastr.error( 'Failed to receive procedure details.' );
				console.error( error );
			} );
	}
	public listProcedures = () => {
		this.targetStreamID = this.mainService.currentItem.steps.filter( step => step.type === DimeProcessStepType.PushData ).map( step => step.referedid )[0];
		if ( this.proceduresAll.length === 0 ) {
			if ( this.mainService.currentItem.target && this.targetStreamID && this.streamService.itemObject[this.targetStreamID] ) {
				// const targetStreamName = this.streamService.itemObject[this.targetStreamID].name;
				// console.log( 'Target:', this.mainService.currentItem.target, 'StreamName:', this.streamService.itemObject[this.targetStreamID].name );
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

}
