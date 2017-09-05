import { ActivatedRoute, Router } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';

import { DimeProcess } from '../../../../../shared/model/dime/process';
import { DimeProcessStep } from '../../../../../shared/model/dime/processstep';
import { DimeProcessStepType } from '../../../../../shared/model/dime/processsteptype';
import { DimeStream } from '../../../../../shared/model/dime/stream';

import { DimeEnvironmentService } from '../dimeenvironment/dimeenvironment.service';
import { DimeStreamService } from '../dimestream/dimestream.service';

@Injectable()
export class DimeProcessService {
	items: Observable<DimeProcess[]>;
	curItem: DimeProcess;
	curItemIsPrepared: boolean;
	curItemIssueList: string[];
	curItemSteps: DimeProcessStep[];
	curItemClean: boolean;
	curItemSourceStream: DimeStream;
	curItemTargetStream: DimeStream;
	curItemSourceFields: any[];
	curItemTargetFields: any[];
	curItemTargetProcedures: any[];
	curItemSelectedProcedure: any;
	curItemLogRecepients: { address: string }[];
	curItemDataRecepients: { address: string }[];
	curItemMissingMapRecepients: { address: string }[];
	curStep: DimeProcessStep;
	curStepManipulations: any[];
	curStepIsPBCS: boolean;
	curItemDefaultTargets: any;
	curItemFilters: any;
	curItemFiltersDataFile: any;
	currentLog: any;
	stepTypes: DimeProcessStepType[];
	private serviceName: string;
	private _items: BehaviorSubject<DimeProcess[]>;
	private baseUrl: string;
	private dataStore: {
		items: DimeProcess[]
	};
	private headers = new Headers( { 'Content-Type': 'application/json' } );

	constructor(
		private http: Http,
		private authHttp: AuthHttp,
		private toastr: ToastrService,
		private router: Router,
		private route: ActivatedRoute,
		private environmentService: DimeEnvironmentService,
		private streamService: DimeStreamService
	) {
		this.baseUrl = '/api/dime/process';
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<DimeProcess[]>>new BehaviorSubject( [] );
		this.items = this._items.asObservable();
		this.serviceName = 'Processes';
		this.resetCurItem();
		this.stepFetchTypes();
	}

	getAll = () => {
		this.fetchAll().
			subscribe(( data ) => {
				data.sort( this.sortByName );
				this.dataStore.items = data;
				this._items.next( Object.assign( {}, this.dataStore ).items );
			}, ( error ) => {
				this.toastr.error( 'Failed to load items.', this.serviceName );
				console.log( error );
			} );
	}
	public fetchAll = () => {
		return this.authHttp.get( this.baseUrl ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	}
	getOne = ( id: number ) => {
		this.fetchOne( id ).
			subscribe(( result ) => {
				let notFound = true;

				this.dataStore.items.forEach(( item, index ) => {
					if ( item.id === result.id ) {
						this.dataStore.items[index] = result;
						notFound = false;
					}
				} );

				if ( notFound ) {
					this.dataStore.items.push( result );
				}

				this.dataStore.items.sort( this.sortByName );
				this._items.next( Object.assign( {}, this.dataStore ).items );
				this.curItem = result;
				if ( this.curItem.status === null ) { this.curItem.status = 'ready'; }
				if ( this.curItem.status !== 'ready' ) { this.checkLog( parseInt( this.curItem.status || '0', 10 ) ); }
				this.curItemClean = true;
				this.isPrepared( this.curItem.id );
				this.stepGetAll( this.curItem.id );
				this.fetchDefaultTargets( this.curItem.id );
				this.fetchFilters( this.curItem.id );
				this.fetchFiltersDataFile( this.curItem.id );
			}, ( error ) => {
				this.toastr.error( 'Failed to get the item.', this.serviceName );
				console.log( error );
			} );
	}
	public fetchOne = ( id: number ) => {
		return this.authHttp.get( this.baseUrl + '/' + id ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	}
	create = () => {
		this.authHttp.post( this.baseUrl, {}, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.dataStore.items.push( result );
				this.dataStore.items.sort( this.sortByName );
				this._items.next( Object.assign( {}, this.dataStore ).items );
				this.resetCurItem();
				this.router.navigate( ['/dime/processes/process-detail', result.id] );
				this.toastr.info( 'New item is created, navigating to the details', this.serviceName );
			}, ( error ) => {
				this.toastr.error( 'Failed to create new item.', this.serviceName );
				console.log( error );
			}
			);
	};
	update = ( curItem?: DimeProcess ) => {
		let shouldUpdate = false;
		if ( !curItem ) { curItem = this.curItem; shouldUpdate = true; };
		this.authHttp.put( this.baseUrl, curItem, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.dataStore.items.forEach(( item, index ) => {
					if ( item.id === result.id ) { this.dataStore.items[index] = result; }
				} );
				this.dataStore.items.sort( this.sortByName );
				this._items.next( Object.assign( {}, this.dataStore ).items );
				this.toastr.info( 'Item is successfully saved.', this.serviceName );
				// If the update request came from another source, then it is an ad-hoc save of a non-current stream.
				// This shouldn't change the state of the current item.
				if ( shouldUpdate ) { this.curItemClean = true; }
				this.stepGetAll( this.curItem.id );
			}, error => {
				this.toastr.error( 'Failed to save the item.', this.serviceName );
				console.log( error );
			} );
	};
	delete( id: number, name?: string ) {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.authHttp.delete( this.baseUrl + '/' + id ).subscribe( response => {
				this.dataStore.items.forEach(( item, index ) => {
					if ( item.id === id ) { this.dataStore.items.splice( index, 1 ); }
				} );
				this.dataStore.items.sort( this.sortByName );
				this._items.next( Object.assign( {}, this.dataStore ).items );
				this.toastr.info( 'Item is deleted.', this.serviceName );
				this.router.navigate( ['/dime/processes/process-list'] );
				this.resetCurItem();
			}, ( error ) => {
				this.toastr.error( 'Failed to delete item.', this.serviceName );
				console.log( error );
			} );
		} else {
			this.toastr.info( 'Item deletion is cancelled.', this.serviceName );
		}
	};
	private resetCurItem = () => {
		this.curItem = { id: 0, name: '-' };
		this.curItemSteps = undefined;
		this.curItemClean = true;
		this.curItemIsPrepared = false;
		this.curItemIssueList = [];
		this.curItemSourceStream = { id: 0, name: '-', type: 0, environment: 0 };
		this.curItemTargetStream = { id: 0, name: '-', type: 0, environment: 0 };
		this.curItemSourceFields = [];
		this.curItemTargetFields = [];
		this.curItemTargetProcedures = [];
		this.curItemSelectedProcedure = {};
		this.curItemLogRecepients = [];
		this.curItemDataRecepients = [];
		this.curItemMissingMapRecepients = [];
		this.curItemDefaultTargets = {};
		this.curItemFilters = {};
		this.curItemFiltersDataFile = {};
		this.curStepIsPBCS = false;
	};
	private sortByName = ( e1, e2 ) => {
		if ( e1.name > e2.name ) {
			return 1;
		} else if ( e1.name < e2.name ) {
			return -1;
		} else {
			return 0;
		}
	};
	public isPrepared = ( id?: number ) => {
		if ( !id ) { id = this.curItem.id; }
		this.curItemIsPrepared = false;
		this.authHttp.get( this.baseUrl + '/isPrepared/' + id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.curItemIsPrepared = result.isPrepared;
				this.curItemIssueList = result.issueList;
			}, ( error ) => {
				this.toastr.error( 'Can not check if the item is prepared. Please check logs.', this.serviceName );
				console.error( error );
			} );
	}
	private stepFetchTypes = () => {
		this.authHttp.get( this.baseUrl + '/steptypes' ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.stepTypes = result;
			}, ( error ) => {
				this.toastr.error( 'Failed to receive process step types.', this.serviceName );
				console.error( error );
			} )
	}
	public stepCreate = () => {
		this.authHttp.post( this.baseUrl + '/step', { process: this.curItem.id }, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.stepGetAll( this.curItem.id );
			}, ( error ) => {
				this.toastr.error( 'Failed to add step.', this.serviceName );
				console.error( error );
			} );
	}
	public stepSaveAll = ( id?: number ) => {
		if ( !id ) { id = this.curItem.id; }
		this.authHttp.put( this.baseUrl + '/steps/' + id, this.curItemSteps, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.toastr.info( 'Changes are saved.', this.serviceName );
				this.stepGetAll( id );
			}, ( error ) => {
				this.toastr.error( 'Failed to save changes on the steps', this.serviceName );
				console.error( error );
			} );
	};
	public stepGetAll = ( id?: number ) => {
		if ( !id ) { id = this.curItem.id; }
		this.authHttp.get( this.baseUrl + '/steps/' + id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.curItemSteps = result;
				this.curItemSteps.forEach(( curStep ) => {
					if ( curStep.type === 'srcprocedure' && this.curItem.source ) { curStep.referedid = this.curItem.source; }
					if ( curStep.type === 'tarprocedure' && this.curItem.target ) { curStep.referedid = this.curItem.target; }
					if ( curStep.type === 'pulldata' ) {
						this.streamService.fetchOne( curStep.referedid ).subscribe(( data ) => {
							this.curItemSourceStream = data;
						}, ( error ) => {
							this.toastr.error( 'Failed to receive the source stream details.', this.serviceName );
							console.log( error );
						} );
						this.streamService.retrieveFieldsFetch( curStep.referedid ).subscribe(( data ) => {
							this.curItemSourceFields = data;
						}, ( error ) => {
							this.toastr.error( 'Failed to receive the source stream fields.', this.serviceName );
							console.log( error );
						} );
					}
					if ( curStep.type === 'pushdata' ) {
						this.streamService.fetchOne( curStep.referedid ).subscribe(( data ) => {
							this.curItemTargetStream = data;
						}, ( error ) => {
							this.toastr.error( 'Failed to receive the target stream details.', this.serviceName );
							console.log( error );
						} );
						this.streamService.retrieveFieldsFetch( curStep.referedid ).subscribe(( data ) => {
							this.curItemTargetFields = data;
						}, ( error ) => {
							this.toastr.error( 'Failed to receive the target stream fields.', this.serviceName );
							console.log( error );
						} );
					}
				} );
				this.isPrepared( id );
			}, ( error ) => {
				this.toastr.error( 'Failed to get the steps.', this.serviceName );
				console.log( error );
			} );
	};
	public stepGetOne = ( id: number ) => {
		this.authHttp.get( this.baseUrl + '/step/' + id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.curStep = result;
				this.stepPrepare();
				if ( this.curItem.id < 1 ) { this.getOne( this.curStep.process ); }
			}, ( error ) => {
				this.toastr.error( 'Failed to get the current step.', this.serviceName );
				console.error( error );
			} );
	};
	public stepPrepare = () => {
		this.curStepIsPBCS = false;
		this.curStepManipulations = [];
		if ( this.curStep.type === 'manipulate' && this.curStep.details ) {
			this.curStepManipulations = JSON.parse( this.curStep.details );
		}
		if ( this.curStep.type === 'tarprocedure' ) {
			if ( this.curStep.details ) {
				this.curItemSelectedProcedure = JSON.parse( this.curStep.details );
				this.stepProcedureSelected( this.curItemSelectedProcedure );
			}
			this.stepListProcedures();
		}
		if ( this.curStep.type === 'sendlogs' && this.curStep.details ) {
			this.curItemLogRecepients = JSON.parse( this.curStep.details );
		}
		if ( this.curStep.type === 'senddata' && this.curStep.details ) {
			this.curItemDataRecepients = JSON.parse( this.curStep.details );
		}
		if ( this.curStep.type === 'sendmissing' && this.curStep.details ) {
			this.curItemMissingMapRecepients = JSON.parse( this.curStep.details );
		}
	}
	public stepDelete = ( id: number ) => {
		this.authHttp.delete( this.baseUrl + '/step/' + id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.stepGetAll( this.curItem.id );
			}, ( error ) => {
				this.toastr.error( 'Failed to delete step.', this.serviceName );
				console.error( error );
			} );
	};
	public stepUpdate = ( curStep?: DimeProcessStep ) => {
		let shouldUpdate = false;
		if ( !curStep ) { curStep = this.curStep; shouldUpdate = true; }
		if ( shouldUpdate && curStep.type === 'srcprocedure' ) { curStep.referedid = this.curItem.source; }
		if ( shouldUpdate && curStep.type === 'tarprocedure' ) { curStep.referedid = this.curItem.target; }
		if ( curStep.type === 'manipulate' ) {
			curStep.details = JSON.stringify( this.curStepManipulations );
			if ( shouldUpdate ) { this.curStep.details = curStep.details; }
		}
		if ( curStep.type === 'tarprocedure' ) {
			curStep.details = JSON.stringify( this.curItemSelectedProcedure );
			if ( shouldUpdate ) { this.curStep.details = curStep.details; }
		}
		if ( curStep.type === 'sendlogs' ) {
			curStep.details = JSON.stringify( this.curItemLogRecepients );
			if ( shouldUpdate ) { this.curStep.details = curStep.details; }
		}
		if ( curStep.type === 'senddata' ) {
			curStep.details = JSON.stringify( this.curItemDataRecepients );
			if ( shouldUpdate ) { this.curStep.details = curStep.details; }
		}
		if ( curStep.type === 'sendmissing' ) {
			curStep.details = JSON.stringify( this.curItemMissingMapRecepients );
			if ( shouldUpdate ) { this.curStep.details = curStep.details; }
		}
		this.authHttp.put( this.baseUrl + '/step', curStep, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.toastr.info( 'Step is successfully saved.', this.serviceName );
				if ( shouldUpdate ) { this.curStep = result; }
				this.stepGetAll( this.curItem.id );
			}, ( error ) => {
				this.toastr.error( 'Step save has failed.', this.serviceName );
				console.error( error );
			} );
	};
	public stepManipulationAdd = () => {
		this.curStepManipulations.push( { mOrder: this.curStepManipulations.length } );
		this.stepManipulationSort();
	};
	public stepManipulationMove = ( curManipulation: any, direction: string ) => {
		const curOrder = curManipulation.mOrder;
		const nextOrder = parseInt( curOrder, 10 ) + ( direction === 'down' ? 1 : -1 );
		this.curStepManipulations.forEach( function ( curField ) {
			if ( curField.mOrder === nextOrder ) {
				curField.mOrder = curOrder;
			}
		} );
		curManipulation.mOrder = nextOrder;
		this.stepManipulationSort();
	};
	public stepManipulationDelete = ( curManipulation: any, index: number ) => {
		if ( index !== undefined ) {
			this.curStepManipulations.splice( index, 1 );
		}
		this.stepManipulationSort();
	};
	public stepManipulationSort = () => {
		this.curStepManipulations.sort(( e1, e2 ) => {
			if ( e1.mOrder > e2.mOrder ) {
				return 1;
			} else if ( e1.mOrder < e2.mOrder ) {
				return -1;
			} else {
				return 0;
			}
		} );
		this.curStepManipulations.forEach(( curManip, curKey ) => {
			curManip.mOrder = curKey;
		} )
	};
	public stepListProcedures = ( numTry?: number ) => {
		if ( numTry === undefined ) { numTry = 0; }
		if ( this.curItem.target && this.curItemTargetStream.id ) {
			this.environmentService.listProcedures( this.curItem.target, this.curItemTargetStream ).
				subscribe(( data ) => {
					this.curItemTargetProcedures = data;
					this.toastr.info( 'Received procedure list' );
				}, ( error ) => {
					this.toastr.error( 'Failed to list procedures.', this.serviceName );
					console.error( error );
				} );
		} else if ( numTry < 100 ) {
			setTimeout(() => {
				// console.log('Environment: ' + this.curItem.source + ', Target Stream: ' + this.curItemTargetStream.id + ' we will retry.', numTry);
				this.stepListProcedures( ++numTry );
			}, 1000 );
		} else {
			this.toastr.error( 'Failed to list procedures.', this.serviceName );
		}
	}
	public stepPBCSProcedureVariableAdd = () => {
		if ( !this.curItemSelectedProcedure.variables ) {
			this.curItemSelectedProcedure.variables = [];
		}
		this.curItemSelectedProcedure.variables.push( { description: '' } );
	}
	public stepProcedureSelected = ( selectedProcedure: any, numTry?: number ) => {
		if ( selectedProcedure !== undefined ) {
			this.curItemSelectedProcedure = selectedProcedure;
		}
		if ( numTry === undefined ) { numTry = 0; }
		if ( this.curItem.target && this.curItemTargetStream.id ) {
			this.environmentService.listProcedureDetails( this.curItem.target, { stream: this.curItemTargetStream, procedure: selectedProcedure } ).
				subscribe(( data ) => {
					if ( Array.isArray( data ) ) {
						this.curItemSelectedProcedure.variables = data;
						this.toastr.info( 'Received procedure details' );
					} else if ( data.environmentType === 'PBCS' ) {
						this.curStepIsPBCS = true;
						this.toastr.info( 'Received procedure details' );
					} else {
						this.toastr.error( 'We could not receive a proper definition for the procedure.' );
					}
				}, ( error ) => {
					this.toastr.error( 'Failed to receive procedure details.', this.serviceName );
					console.log( error );
				} )
		} else if ( numTry < 100 ) {
			setTimeout(() => {
				this.stepProcedureSelected( selectedProcedure, ++numTry );
			}, 1000 );
		} else {
			this.toastr.error( 'Failed to fetch procedure details.', this.serviceName );
		}
	}
	public stepRecepientAdd = ( curList: any[] ) => {
		if ( !curList ) {
			this.toastr.error( 'There is no list assigned to add recepient. Please consult system admin about this issue.' );
		} else {
			curList.push( { address: '' } );
		}
	}
	public stepRecepientDelete = ( curList: any[], index: number ) => {
		console.log( index, curList[index] );
		if ( index !== undefined ) {
			console.log( curList.splice( index, 1 ) );
		}
	};
	public stepDetailPresenter = ( detail: string, type: string ): string => {
		let toReturn: string; toReturn = '';
		if ( ( type === 'sendmissing' || type === 'senddata' || type === 'sendlogs' ) && detail ) {
			const recepientList: { address: string }[] = JSON.parse( detail );
			toReturn = recepientList.map( curRecepient => curRecepient.address ).join( '; ' );
		} else if ( type === 'tarprocedure' && detail ) {
			const procedureDetails = JSON.parse( detail );
			toReturn = procedureDetails.name;
		} else if ( type === 'manipulate' && detail ) {
			const manipulations = JSON.parse( detail );
			toReturn = manipulations.length + ' transformations.';
		} else if ( type === 'pushdata' ) {
			toReturn = 'Data push to the target stream.';
		} else if ( type === 'pulldata' ) {
			toReturn = 'Data pull from the source stream.';
		} else if ( type === 'srcprocedure' ) {
			toReturn = detail.toString().substr( 0, 30 );
			if ( detail.toString().length > 30 ) { toReturn += '...'; }
		} else if ( type === 'mapdata' ) {
			toReturn = 'Data map between streams.';
		} else {
			console.log( 'Missing step definition. Please complete the definition for each step.' );
		}
		return toReturn;
	}
	public stepMoveOrder = ( curStep: any, direction: string ) => {
		const curOrder = curStep.sOrder;
		const nextOrder = parseInt( curOrder, 10 ) + ( direction === 'down' ? 1 : -1 );
		this.curItemSteps.forEach(( curField ) => {
			if ( curField.sOrder === nextOrder ) { curField.sOrder = curOrder; }
		} );
		curStep.sOrder = nextOrder;
		this.stepSort();
	};
	public stepSort = () => {
		this.curItemSteps.sort(( e1, e2 ) => {
			if ( e1.sOrder > e2.sOrder ) {
				return 1;
			} else if ( e1.sOrder < e2.sOrder ) {
				return -1;
			} else {
				return 0;
			}
		} );
		this.curItemSteps.forEach(( curManip, curKey ) => {
			curManip.sOrder = curKey + 1;
		} )
	};
	public applyDefaultTargets = () => {
		this.authHttp.put( this.baseUrl + '/defaults/' + this.curItem.id, this.curItemDefaultTargets, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.toastr.info( 'Default targets are saved', this.serviceName );
			}, ( error ) => {
				this.toastr.error( 'Failed to save default targets.', this.serviceName );
				console.error( error );
			} );
	};
	public fetchDefaultTargets = ( id?: number ) => {
		if ( !id ) { id = this.curItem.id; }
		this.authHttp.get( this.baseUrl + '/defaults/' + id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				result.forEach(( curDefault ) => {
					this.curItemDefaultTargets[curDefault.field] = curDefault.value;
				} );
				// this.curItemDefaultTargets = result;
			}, ( error ) => {
				this.toastr.error( 'Failed to receive default targets.', this.serviceName );
				console.error( error );
			} );
	}
	public applyFilters = () => {
		let toSend: any; toSend = {};
		toSend.process = this.curItem.id;
		toSend.stream = this.curItemSourceStream.id;
		toSend.filters = [];
		Object.keys( this.curItemFilters ).forEach(( curKey ) => {
			let toPush: any; toPush = {};
			this.curItemSourceFields.forEach(( curField ) => {

				if ( curField.name === curKey ) {
					toPush.field = curField.id;
				} else {
				}
			} );
			toPush.filterfrom = this.curItemFilters[curKey].filterfrom;
			toPush.filterto = this.curItemFilters[curKey].filterto;
			toPush.filtertext = this.curItemFilters[curKey].filtertext;
			toPush.filterbeq = this.curItemFilters[curKey].filterbeq;
			toPush.filterseq = this.curItemFilters[curKey].filterseq;
			toSend.filters.push( toPush );
		} );
		this.authHttp.put( this.baseUrl + '/filters/' + this.curItem.id, toSend, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.toastr.info( 'Successfully applied filters.', this.serviceName );
			}, ( error ) => {
				this.toastr.error( 'Failed to apply filters.', this.serviceName );
				console.error( error );
			} );
	};
	public applyFiltersDataFile = () => {
		let toSend: any; toSend = {};
		toSend.process = this.curItem.id;
		toSend.stream = this.curItemSourceStream.id;
		toSend.filters = [];
		Object.keys( this.curItemFiltersDataFile ).forEach(( curKey ) => {
			let toPush: any; toPush = {};
			this.curItemSourceFields.forEach(( curField ) => {

				if ( curField.name === curKey ) {
					toPush.field = curField.id;
				} else {
				}
			} );
			toPush.filterfrom = this.curItemFiltersDataFile[curKey].filterfrom;
			toPush.filterto = this.curItemFiltersDataFile[curKey].filterto;
			toPush.filtertext = this.curItemFiltersDataFile[curKey].filtertext;
			toPush.filterbeq = this.curItemFiltersDataFile[curKey].filterbeq;
			toPush.filterseq = this.curItemFiltersDataFile[curKey].filterseq;
			toSend.filters.push( toPush );
		} );
		this.authHttp.put( this.baseUrl + '/filtersdatafile/' + this.curItem.id, toSend, { headers: this.headers } ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.toastr.info( 'Successfully applied data file filters.', this.serviceName );
			}, ( error ) => {
				this.toastr.error( 'Failed to apply data file filters.', this.serviceName );
				console.error( error );
			} );
	};
	public fetchFiltersDataFile = ( id?: number ) => {
		if ( !id ) { id = this.curItem.id; }
		this.fetchFiltersDataFileFetch( id ).
			subscribe(( result ) => {
				this.prepareFiltersDataFile( result );
			}, ( error ) => {
				this.toastr.error( '', this.serviceName );
				console.error( error );
			} );
	};
	public fetchFiltersDataFileFetch = ( id: number ) => {
		return this.authHttp.get( this.baseUrl + '/filtersdatafile/' + id ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	};
	public fetchFilters = ( id?: number ) => {
		if ( !id ) { id = this.curItem.id; }
		this.fetchFiltersFetch( id ).
			subscribe(( result ) => {
				this.prepareFilters( result );
			}, ( error ) => {
				this.toastr.error( '', this.serviceName );
				console.error( error );
			} );
	};
	public fetchFiltersFetch = ( id: number ) => {
		return this.authHttp.get( this.baseUrl + '/filters/' + id ).
			map( response => response.json() ).
			catch( error => Observable.throw( error ) );
	};
	private prepareFiltersDataFile = ( filterArray: any[], numTry?: number ) => {
		if ( numTry === undefined ) { numTry = 0; }
		if ( this.curItemSourceFields.length > 0 ) {
			this.curItemSourceFields.forEach(( curField ) => {
				if ( curField.isCrossTabFilter ) {
					this.curItemFiltersDataFile[curField.name] = {};
				}
			} );
			filterArray.forEach(( curFilter ) => {
				this.curItemSourceFields.forEach(( curField ) => {
					if ( curField.id === curFilter.field ) { curFilter.fieldname = curField.name; }
				} );
				if ( curFilter.stream === this.curItemSourceStream.id && curFilter.field ) {
					const theDate = new Date( curFilter.filterfrom );
					if ( curFilter.filterfrom ) { this.curItemFiltersDataFile[curFilter.fieldname].filterfrom = curFilter.filterfrom; }
					if ( curFilter.filterto ) { this.curItemFiltersDataFile[curFilter.fieldname].filterto = curFilter.filterto; }
					if ( curFilter.filtertext ) { this.curItemFiltersDataFile[curFilter.fieldname].filtertext = curFilter.filtertext; }
					if ( curFilter.filterbeq ) { this.curItemFiltersDataFile[curFilter.fieldname].filterbeq = curFilter.filterbeq; }
					if ( curFilter.filterseq ) { this.curItemFiltersDataFile[curFilter.fieldname].filterseq = curFilter.filterseq; }
				}
			} );
		} else if ( numTry < 100 ) {
			setTimeout(() => {
				this.prepareFiltersDataFile( filterArray, ++numTry );
			}, 1000 );
		} else {
			this.toastr.error( 'Failed to prepare filters data file.', this.serviceName );
		}
	};
	private prepareFilters = ( filterArray: any[], numTry?: number ) => {
		if ( numTry === undefined ) { numTry = 0; }
		if ( this.curItemSourceFields.length > 0 ) {
			this.curItemSourceFields.forEach(( curField ) => {
				if ( curField.isFilter === 1 ) {
					this.curItemFilters[curField.name] = {};
				}
			} );
			filterArray.forEach(( curFilter ) => {
				this.curItemSourceFields.forEach(( curField ) => {
					if ( curField.id === curFilter.field ) { curFilter.fieldname = curField.name; }
				} );
				if ( curFilter.stream === this.curItemSourceStream.id && curFilter.field ) {
					const theDate = new Date( curFilter.filterfrom );
					if ( curFilter.filterfrom ) { this.curItemFilters[curFilter.fieldname].filterfrom = curFilter.filterfrom; }
					if ( curFilter.filterto ) { this.curItemFilters[curFilter.fieldname].filterto = curFilter.filterto; }
					if ( curFilter.filtertext ) { this.curItemFilters[curFilter.fieldname].filtertext = curFilter.filtertext; }
					if ( curFilter.filterbeq ) { this.curItemFilters[curFilter.fieldname].filterbeq = curFilter.filterbeq; }
					if ( curFilter.filterseq ) { this.curItemFilters[curFilter.fieldname].filterseq = curFilter.filterseq; }
				}
			} );
		} else if ( numTry < 100 ) {
			setTimeout(() => {
				this.prepareFilters( filterArray, ++numTry );
			}, 1000 );
		} else {
			this.toastr.error( 'Failed to prepare filters.', this.serviceName );
		}
	};
	public processRun = () => {
		this.authHttp.get( this.baseUrl + '/run/' + this.curItem.id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.curItem.status = result.status;
				this.checkLog( result.status );
			}, ( error ) => {
				this.toastr.error( '', this.serviceName );
				console.error( error );
			} );
	}
	public checkLog = ( id: number ) => {
		this.authHttp.get( '/api/log/' + id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.currentLog = result.details;
				if ( result.start === result.end ) {
					setTimeout(() => {
						this.checkLog( id );
					}, 2000 );
				}

			}, ( error ) => {
				this.toastr.error( 'Failed to retrieve log records.', this.serviceName );
				console.error( error );
			} );
	};
	public processUnlock = () => {
		if ( confirm( 'Are you sure you want to unlock the process? This does not cancel the running process.' ) ) {
			this.authHttp.get( this.baseUrl + '/unlock/' + this.curItem.id ).
				map( response => response.json() ).
				subscribe(( result ) => {
					this.toastr.info( 'Process unlocked successfully.', this.serviceName );
				}, ( error ) => {
					this.toastr.error( 'Unlocking process failed.', this.serviceName );
					console.error( error );
				} );
		} else {
			this.toastr.info( 'Unlock of process cancelled.', this.serviceName );
		}
	};
	public sendDataFile = ( id: number ) => {
		this.authHttp.get( this.baseUrl + '/sendDataFile/' + id ).
			map( response => response.json() ).
			subscribe(( result ) => {
				this.toastr.info( 'Process data file will be sent to your inbox.' );
			}, ( error ) => {
				this.toastr.error( 'Process file can not be send.', this.serviceName );
				console.error( error );
			} );
	}
}
